use crate::dtos::articles::{ArticleData, ArticleResponseSchema, FilterArticleSchema, CreateArticleSchema, ArticlesListResponseSchema, UpdateArticleSchema};
use crate::dtos::common::Response;
use crate::dtos::projects::{ProjectData, ProjectResponseSchema, ProjectsListResponseSchema, CreateProjectSchema, UpdateProjectSchema, FilterProjectSchema};
use crate::dtos::users::{
    FilterUserSchema, LoginUserSchema, RegisterUserSchema, UserData, UserListResponseSchema,
    UserLoginResponseSchema, UserResponseSchema,
};
use crate::handlers::{files, auth, healthchecker, users, articles, projects};
use crate::models::user::UserRole;
use utoipa::{
    openapi::security::{HttpAuthScheme, HttpBuilder, SecurityScheme},
    Modify, OpenApi,
};

#[derive(OpenApi)]
#[openapi(
    paths(
        files::upload_file::post_file, 
        files::remove_file::delete_file, 
        files::get_file::fetch_file, 

        auth::login::login,
        auth::logout::logout,
        auth::register::register, 

        users::auth_user::get_me, 
        users::get_user::get_user_by_id, 
        users::all::get_users, 
        users::change_role::change_role_by_id, 
        users::change_pass::change_pass,
        users::remove_user::remove_user,

        articles::get_all::all_articles,
        articles::get_one::get_article,
        articles::update::change_article,
        articles::create::create_article,
        articles::remove::remove_article,

        projects::get_all::all_projects,
        projects::get_one::get_project,
        projects::update::change_project,
        projects::create::create_project,
        projects::remove::remove_project,

        healthchecker::health_checker_handler
    ),
    components(
        schemas(
            Response,

            UserRole,

            UserData,
            UserResponseSchema,
            UserLoginResponseSchema,
            UserListResponseSchema,
            FilterUserSchema,
            LoginUserSchema,
            RegisterUserSchema,

            ArticleData,
            ArticleResponseSchema,
            ArticlesListResponseSchema,
            CreateArticleSchema,
            UpdateArticleSchema,
            FilterArticleSchema,

            ProjectData,
            ProjectResponseSchema,
            ProjectsListResponseSchema,
            CreateProjectSchema,
            UpdateProjectSchema,
            FilterProjectSchema,
        )
    ),
    tags(
        (name = "RUST ADMIN REST API", description = "Rust Admin Endpoints by RAprogramm")
    ),
    modifiers(&SecurityAddon)
)]
pub struct ApiDoc;

pub struct SecurityAddon;

impl Modify for SecurityAddon {
    fn modify(&self, openapi: &mut utoipa::openapi::OpenApi) {
        let components = openapi.components.as_mut().unwrap();
        components.add_security_scheme(
            "token",
            SecurityScheme::Http(
                HttpBuilder::new()
                    .scheme(HttpAuthScheme::Bearer)
                    .bearer_format("JWT")
                    .build(),
            ),
        )
    }
}
