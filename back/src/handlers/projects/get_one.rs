use actix_web::{web, HttpResponse};

use crate::{
    database::projects::ProjectExt,
    dtos::projects::{FilterProjectSchema, ProjectData, ProjectResponseSchema},
    errors::HttpError,
    AppState,
};

/// Get project
#[utoipa::path(
    get,
    path = "/api/projects/{id}",
    tag = "Projects Endpoints",
    params(
        ("id", description = "Unique storage id of project")
    ),
    responses(
        (status = 204, description = "Project was found", body= ProjectResponseSchema),
        (status = 400, description = "Bad Request", body = Response),
        (status = 404, description = "Project not found", body = Response),
        (status = 403, description = "Forbidden", body = Response),
        (status = 500, description = "Internal Server Error", body = Response),
    ),
    security(
        ("token" = [])
    )
)]
pub async fn get_project(
    app_state: web::Data<AppState>,
    project_id: web::Path<uuid::Uuid>,
) -> Result<HttpResponse, HttpError> {
    let project = app_state
        .db_client
        .get_project(Some(*project_id))
        .await?
        .ok_or(HttpError::not_found("Project not found"))?;

    let filtered_project = FilterProjectSchema::filter_project(&project);

    let response_data = ProjectResponseSchema {
        status: "success".to_string(),
        data: ProjectData {
            project: filtered_project,
        },
    };

    Ok(HttpResponse::Ok().json(response_data))
}
