use actix_web::{web, HttpResponse};
use sqlx::Error;
use validator::Validate;

use crate::{
    database::projects::ProjectExt, dtos::projects::CreateProjectSchema, errors::HttpError,
    AppState,
};

/// Create a new project
#[utoipa::path(
    post,
    path = "/api/projects/",
    tag = "Projects Endpoints",
    request_body(content = CreateProjectSchema, description = "Data for creating a new project", example = json!({"title": "Example Title 1", "category": "Example category","description": "Example description","cover": "example_cover.png","tags": ["tag1", "tag2"]})),
    responses(
        (status=201, description= "Project created successfully", body= ProjectResponseSchema),
        (status=400, description= "Validation Errors", body= Response),
        (status=500, description= "Internal Server Error", body= Response ),
    ),
    security(
        ("token" = [])
    )
)]
pub async fn create_project(
    app_state: web::Data<AppState>,
    body: web::Json<CreateProjectSchema>,
) -> Result<HttpResponse, HttpError> {
    body.validate()
        .map_err(|e| HttpError::bad_request(e.to_string()))?;

    let result = app_state
        .db_client
        .save_project(
            &body.title,
            &body.description,
            &body.cover,
            &body.category,
            body.tags.clone(),
        )
        .await;

    match result {
        Ok(project) => Ok(HttpResponse::Created().json(project)),
        Err(Error::Database(db_err)) => {
            if db_err.is_unique_violation() {
                Err(HttpError::unique_constraint_voilation(
                    "Project with this slug or title already exists",
                ))
            } else {
                Err(HttpError::server_error(db_err.to_string()))
            }
        }
        Err(e) => Err(HttpError::server_error(e.to_string())),
    }
}
