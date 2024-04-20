use actix_web::{web, HttpResponse};
use sqlx::Error;
use validator::Validate;

use crate::{
    database::articles::ArticleExt, dtos::articles::CreateArticleSchema, errors::HttpError,
    extractors::auth::Authenticated, AppState,
};

/// Create a new article
#[utoipa::path(
    post,
    path = "/api/articles",
    tag = "Articles Endpoints",
    request_body(content = CreateArticleSchema, description = "Data for creating a new article", example = json!({"title": "Article Title","content": "Example article content","cover": "example_cover.png","tags": ["IT", "FrontEnd", "React"]})),
    responses(
        (status=201, description= "Article created successfully", body= ArticleResponseSchema),
        (status=400, description= "Validation Errors", body= Response),
        (status=500, description= "Internal Server Error", body= Response ),
    ),
    security(
        ("token" = [])
    )
)]
pub async fn create_article(
    app_state: web::Data<AppState>,
    body: web::Json<CreateArticleSchema>,
    user: Authenticated,
) -> Result<HttpResponse, HttpError> {
    body.validate()
        .map_err(|e| HttpError::bad_request(e.to_string()))?;

    let author_id = user;

    let result = app_state
        .db_client
        .save_article(
            &body.title,
            &body.content,
            &body.cover,
            author_id,
            body.tags.clone(),
        )
        .await;

    match result {
        Ok(article) => Ok(HttpResponse::Created().json(article)),
        Err(Error::Database(db_err)) => {
            if db_err.is_unique_violation() {
                Err(HttpError::unique_constraint_voilation(
                    "Article with this slug or title already exists",
                ))
            } else {
                Err(HttpError::server_error(db_err.to_string()))
            }
        }
        Err(e) => Err(HttpError::server_error(e.to_string())),
    }
}
