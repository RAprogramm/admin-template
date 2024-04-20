use crate::{
    database::projects::ProjectExt, dtos::projects::UpdateProjectSchema, errors::HttpError,
    extractors::auth::Authenticated, AppState,
};
use actix_web::{web, HttpResponse};

/// Update project
#[utoipa::path(
    patch,
    path = "/api/projects/{id}",
    tag = "Projects Endpoints",
    request_body(content = UpdateProjectSchema, description = "Data for updating the project", example = json!({"title": "Updated Title","description": "Updated description","cover": "updated_cover.png", "category": "Updated category", "tags": ["updated_tag1", "updated_tag2"]})),
    params(
        ("id" = Uuid, Path, description = "Unique id of the project to update")
    ),
    responses(
        (status = 200, description = "Project updated successfully", body = ProjectResponseSchema),
        (status = 400, description = "Bad Request", body = Response),
        (status = 404, description = "Project not found", body = Response),
        (status = 403, description = "Forbidden", body = Response),
        (status = 500, description = "Internal Server Error", body = Response),
    ),
    security(
        ("token" = [])
    )
)]
pub async fn change_project(
    app_state: web::Data<AppState>,
    project_id: web::Path<uuid::Uuid>,
    body: web::Json<UpdateProjectSchema>,
    user: Authenticated,
) -> Result<HttpResponse, HttpError> {
    let user_id = user.id;

    let has_permission = app_state.db_client.user_permission(user_id).await?;

    if !has_permission {
        return Err(HttpError::forbidden(
            "You do not have permission to delete this project",
        ));
    }

    let update_result = app_state
        .db_client
        .update_project(
            Some(*project_id),
            body.title.clone().unwrap_or_default(),
            body.description.clone().unwrap_or_default(),
            body.category.clone().unwrap_or_default(),
            body.cover.clone().unwrap_or_default(),
            body.tags.clone().unwrap_or_default(),
        )
        .await?;

    match update_result {
        Some(project) => Ok(HttpResponse::Ok().json(project)),
        None => Err(HttpError::not_found("Project not found")),
    }
}
