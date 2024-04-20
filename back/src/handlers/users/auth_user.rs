use actix_web::HttpResponse;

use crate::{
    dtos::users::{FilterUserSchema, UserData, UserResponseSchema},
    errors::HttpError,
    extractors::auth::Authenticated,
};

/// Authenticated user info
#[utoipa::path(
    get,
    path = "/api/users/me",
    tag = "Users Endpoints",
    responses(
        (status = 200, description= "Authenticated User", body = UserResponseSchema),
        (status= 500, description= "Internal Server Error", body = Response )
       
    ),
    security(
       ("token" = [])
   )
)]
pub async fn get_me(user: Authenticated) -> Result<HttpResponse, HttpError> {
    let filtered_user = FilterUserSchema::filter_user(&user);

    let response_data = UserResponseSchema {
        status: "success".to_string(),
        data: UserData {
            user: filtered_user,
        },
    };

    Ok(HttpResponse::Ok().json(response_data))
}
