use actix_web::{web, HttpResponse};
use validator::Validate;

use crate::{
    database::users::UserExt,
    dtos::{
        common::RequestQuerySchema,
        users::{FilterUserSchema, UserListResponseSchema},
    },
    errors::HttpError,
    AppState,
};

/// All users
#[utoipa::path(
    get,
    path = "/api/users",
    tag = "Users Endpoints",
    params(
        RequestQuerySchema
    ),
    responses(
        (status = 200, description= "All Users", body = [UserListResponseSchema]),
        (status=401, description= "Authentication Error", body= Response),
        (status=403, description= "Permission Denied Error", body= Response),
        (status= 500, description= "Internal Server Error", body = Response )
       
    ),
    security(
       ("token" = [])
   )
)]
pub async fn get_users(
    query: web::Query<RequestQuerySchema>,
    app_state: web::Data<AppState>,
) -> Result<HttpResponse, HttpError> {
    let query_params: RequestQuerySchema = query.into_inner();

    query_params
        .validate()
        .map_err(|e| HttpError::bad_request(e.to_string()))?;

    let page = query_params.page.unwrap_or(1);
    let limit = query_params.limit.unwrap_or(10);

    // Getting the total number of users
    let total_users = app_state
        .db_client
        .get_users_count()
        .await
        .map_err(|e| HttpError::server_error(e.to_string()))?;

    // Calculation of the total number of pages
    let total_pages = (total_users as f64 / limit as f64).ceil() as usize;

    let users = app_state
        .db_client
        .get_users(page as u32, limit)
        .await
        .map_err(|e| HttpError::server_error(e.to_string()))?;

    Ok(HttpResponse::Ok().json(UserListResponseSchema {
        status: "success".to_string(),
        users: FilterUserSchema::filter_users(&users),
        results: users.len(),
        total_results: total_users as usize,
        total_pages,
    }))
}
