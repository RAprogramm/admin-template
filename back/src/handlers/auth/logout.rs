use actix_web::{
    cookie::time::Duration as ActixWebDuration,
    cookie::{Cookie, SameSite},
    HttpResponse, Responder,
};
use serde_json::json;

/// Logout user from system
#[utoipa::path(
    post,
    path = "/api/auth/logout",
    tag = "Auth Endpoints",
    responses(
        (status=200, description= "Logout successfull" ),
        (status=400, description= "Validation Errors", body= Response ),
        (status=401, description= "Unauthorize Error", body= Response),
        (status=500, description= "Internal Server Error", body= Response ),
    ),
    security(
       ("token" = [])
   )
)]
pub async fn logout() -> impl Responder {
    let cookie = Cookie::build("token", "")
        .path("/")
        .max_age(ActixWebDuration::new(-1, 0))
        // .http_only(true)
        .secure(true) // uncomment in production mode with HTTPS
        .same_site(SameSite::Lax)
        .finish();

    HttpResponse::Ok()
        .cookie(cookie)
        .json(json!({"status": "success"}))
}
