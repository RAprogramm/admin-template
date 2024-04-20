use actix_web::{web, HttpResponse};

use crate::{
    database::users::UserExt, errors::HttpError, extractors::auth::Authenticated,  AppState
};

/// Delete user
#[utoipa::path(
    delete,
    path = "/api/users/{id}",
    tag = "Users Endpoints",
    params(
        ("id", description = "Unique id of the user to remove")
    ),
    responses(
        (status = 204, description= "User has been deleted"),
        (status = 400, description = "Bad Request", body = Response),
        (status = 404, description = "User not found", body = Response),
        (status = 403, description = "Forbidden", body = Response),
        (status = 500, description = "Internal Server Error", body = Response),
       
    ),
    security(
       ("token" = [])
   )
)]
pub async fn remove_user(
    app_state: web::Data<AppState>,
    target_user_id: web::Path<uuid::Uuid>,
    user: Authenticated,
) -> Result<HttpResponse, HttpError> {
    let user_id = user.id;

    let has_permission = app_state.db_client.user_permission(user_id).await?;

    if !has_permission {
        return Err(HttpError::forbidden(
            "You do not have permission to remove users",
        ));
    }

    app_state
        .db_client
        .delete_user( Some(*target_user_id))
        .await?;

    Ok(HttpResponse::NoContent().finish())
}
