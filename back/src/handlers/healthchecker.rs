use actix_web::{get, HttpResponse, Responder};

use crate::dtos::common::Response;

/// It's OK?
#[utoipa::path(
    get,
    path = "/api/healthchecker",
    tag = "Health Checker Endpoint",
    responses(
        (status = 200, description= "Authenticated User", body = Response),       
    ),
    security(
        ("token" = [])
    )
)]
#[get("/api/healthchecker")]
async fn health_checker_handler() -> impl Responder {
    HttpResponse::Ok().json(Response {
        status: "success",
        message: "Rust Admin".to_string(),
    })
}
