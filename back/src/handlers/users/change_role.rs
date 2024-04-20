use actix_web::{web, HttpResponse};

use crate::{
    database::users::UserExt, dtos::users::UpdateUserSchema, errors::HttpError,
    extractors::auth::Authenticated, AppState,
};

/// Update user role
#[utoipa::path(
    patch,
    path = "/api/users/{id}",
    tag = "Users Endpoints",
    request_body(content = UpdateUserSchema, description = "Data for updating the user role", example = json!({"role": "moderator"})),
    params(
        ("id" = Uuid, Path, description = "Unique id of the user to update")
    ),
    responses(
        (status = 200, description= "Updated User", body = UserResponseSchema),
        (status= 500, description= "Internal Server Error", body = Response )
       
    ),
    security(
       ("token" = [])
   )
)]
pub async fn change_role_by_id(
    app_state: web::Data<AppState>,
    target_user_id: web::Path<uuid::Uuid>,
    body: web::Json<UpdateUserSchema>,
    user: Authenticated,
) -> Result<HttpResponse, HttpError> {
    let user_id = user.id;

    let has_permission = app_state.db_client.user_permission(user_id).await?;

    if !has_permission {
        return Err(HttpError::forbidden(
            "You do not have permission to update users",
        ));
    }

    let update_result = app_state
        .db_client
        .update_user(Some(*target_user_id), body.role.clone().unwrap_or_default())
        .await?;

    match update_result {
        Some(user) => Ok(HttpResponse::Ok().json(user)),
        None => Err(HttpError::not_found("User not found")),
    }
}
