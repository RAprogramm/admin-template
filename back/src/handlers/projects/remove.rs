use crate::{
    database::projects::ProjectExt, errors::HttpError, extractors::auth::Authenticated, AppState,
};
use actix_web::{web, HttpResponse};

/// Delete project
#[utoipa::path(
    delete,
    path = "/api/projects/{id}",
    tag = "Projects Endpoints",
    params(
        ("id", description = "Unique storage id of project")
    ),
    responses(
        (status = 204, description = "Project deleted successfully"),
        (status = 400, description = "Bad Request", body = Response),
        (status = 404, description = "Project not found", body = Response),
        (status = 403, description = "Forbidden", body = Response),
        (status = 500, description = "Internal Server Error", body = Response),
    ),
    security(
        ("token" = [])
    )
)]
pub async fn remove_project(
    app_state: web::Data<AppState>,
    project_id: web::Path<uuid::Uuid>,
    user: Authenticated,
) -> Result<HttpResponse, HttpError> {
    let user_id = user.id;

    let has_permission = app_state.db_client.user_permission(user_id).await?;

    if !has_permission {
        return Err(HttpError::forbidden(
            "You do not have permission to delete this project",
        ));
    }

    app_state
        .db_client
        .delete_project(Some(*project_id))
        .await?;

    Ok(HttpResponse::NoContent().finish())
}
