use actix_web::{web, HttpResponse};

use crate::{
    database::users::UserExt,
    dtos::users::{FilterUserSchema, UserData, UserResponseSchema},
    errors::HttpError,
    AppState,
};

/// Get user
#[utoipa::path(
    get,
    path = "/api/users/{id}",
    tag = "Users Endpoints",
    params(
        ("id", description = "Unique storage id of User")
    ),
    responses(
        (status = 204, description = "User was found", body= UserResponseSchema),
        (status = 400, description = "Bad Request", body = Response),
        (status = 404, description = "User not found", body = Response),
        (status = 403, description = "Forbidden", body = Response),
        (status = 500, description = "Internal Server Error", body = Response),
    ),
    security(
        ("token" = [])
    )
)]
pub async fn get_user_by_id(
    app_state: web::Data<AppState>,
    user_id: web::Path<uuid::Uuid>,
) -> Result<HttpResponse, HttpError> {
    let user = app_state
        .db_client
        .get_user(Some(*user_id), None, None)
        .await?
        .ok_or(HttpError::not_found("User not found"))?;

    let filtered_user = FilterUserSchema::filter_user(&user);

    let response_data = UserResponseSchema {
        status: "success".to_string(),
        data: UserData {
            user: filtered_user,
        },
    };

    Ok(HttpResponse::Ok().json(response_data))
}
