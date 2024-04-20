use crate::{extractors::auth::RequireAuth, models::user::UserRole};
use actix_web::{web, Scope};

use super::files::{get_file::fetch_file, remove_file::delete_file, upload_file::post_file};

pub fn files_handlers() -> Scope {
    web::scope("/api/files")
        .route(
            "/{file_path}",
            web::get()
                .to(fetch_file)
                .wrap(RequireAuth::allowed_roles(vec![
                    UserRole::User,
                    UserRole::Moderator,
                    UserRole::Admin,
                ])),
        )
        .route(
            "/",
            web::post()
                .to(post_file)
                .wrap(RequireAuth::allowed_roles(vec![
                    UserRole::Moderator,
                    UserRole::Admin,
                ])),
        )
        .route(
            "/{file_path}",
            web::delete()
                .to(delete_file)
                .wrap(RequireAuth::allowed_roles(vec![
                    UserRole::Moderator,
                    UserRole::Admin,
                ])),
        )
}
