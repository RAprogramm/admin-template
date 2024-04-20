use crate::{extractors::auth::RequireAuth, models::user::UserRole};
use actix_web::{web, Scope};

use super::auth::{login::login, logout::logout, register::register};

pub fn auth_handlers() -> Scope {
    web::scope("/api/auth")
        .route("/register", web::post().to(register))
        .route("/login", web::post().to(login))
        .route(
            "/logout",
            web::post().to(logout).wrap(RequireAuth::allowed_roles(vec![
                UserRole::User,
                UserRole::Moderator,
                UserRole::Admin,
            ])),
        )
}
