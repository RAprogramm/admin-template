mod config;
mod database;
mod db;
mod dtos;
mod errors;
mod extractors;
mod handlers;
mod models;
mod swager;
mod utils;

use actix_cors::Cors;
use actix_web::{http::header, middleware::Logger, web, App, HttpServer};
use config::Config;
use db::DBClient;
use dotenv::dotenv;
use env_logger::Builder;
use sqlx::postgres::PgPoolOptions;
use utoipa::OpenApi;
use utoipa_swagger_ui::SwaggerUi;

use crate::{
    handlers::healthchecker::health_checker_handler, swager::ApiDoc,
    utils::admin::create_admin_if_not_exists,
};

#[derive(Debug, Clone)]
pub struct AppState {
    pub env: Config,
    pub db_client: DBClient,
}

#[actix_web::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    dotenv().ok();
    Builder::new().parse_env("LOG_LEVEL").init();

    let config = Config::init();

    let pool = PgPoolOptions::new()
        .max_connections(10)
        .connect(&config.database_url)
        .await?;

    match sqlx::migrate!("./migrations").run(&pool).await {
        Ok(_) => log::info!("Migrations executed successfully."),
        Err(e) => log::error!("Error executing migrations: {}", e),
    };

    create_admin_if_not_exists(&pool).await?;

    let db_client = DBClient::new(pool);
    let app_state: AppState = AppState {
        env: config.clone(),
        db_client,
    };

    log::info!(
        "{}",
        format!(
            "Server is running on {}:{}",
            config.back_url, config.back_port
        )
    );

    let openapi = ApiDoc::openapi();

    HttpServer::new(move || {
        let cors = Cors::default()
            .allowed_origin(format!("{}:{}", config.front_url, config.front_port).as_str())
            .allowed_origin(format!("{}:{}", config.back_url, config.back_port).as_str())
            .allowed_methods(vec!["GET", "POST", "PATCH", "DELETE"])
            .allowed_headers(vec![
                header::CONTENT_TYPE,
                header::AUTHORIZATION,
                header::ACCEPT,
            ])
            .supports_credentials();

        let app = App::new()
            .app_data(web::Data::new(app_state.clone()))
            .wrap(cors)
            .wrap(Logger::default())
            .service(handlers::files_scope::files_handlers())
            .service(handlers::auth_scope::auth_handlers())
            .service(handlers::users_scope::users_handlers())
            .service(handlers::articles_scope::articles_handlers())
            .service(handlers::projects_scope::projects_handlers())
            .service(health_checker_handler);

        app.service(SwaggerUi::new("/{_:.*}").url("/api-docs/openapi.json", openapi.clone()))
    })
    .bind(("0.0.0.0", config.port))?
    .run()
    .await?;

    Ok(())
}
