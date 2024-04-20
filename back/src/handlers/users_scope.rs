use super::users::{
    all::get_users, auth_user::get_me, change_pass::change_pass, change_role::change_role_by_id,
    get_user::get_user_by_id, remove_user::remove_user,
};
use crate::{extractors::auth::RequireAuth, models::user::UserRole};
use actix_web::{web, Scope};

pub fn users_handlers() -> Scope {
    web::scope("/api/users")
        .route(
            "",
            web::get()
                .to(get_users)
                .wrap(RequireAuth::allowed_roles(vec![UserRole::Admin])),
        )
        .route(
            "/pass",
            web::patch()
                .to(change_pass)
                .wrap(RequireAuth::allowed_roles(vec![UserRole::Admin])),
        )
        .route(
            "/me",
            web::get().to(get_me).wrap(RequireAuth::allowed_roles(vec![
                UserRole::User,
                UserRole::Moderator,
                UserRole::Admin,
            ])),
        )
        .route(
            "/{id}",
            web::delete()
                .to(remove_user)
                .wrap(RequireAuth::allowed_roles(vec![UserRole::Admin])),
        )
        .route(
            "/{id}",
            web::get()
                .to(get_user_by_id)
                .wrap(RequireAuth::allowed_roles(vec![UserRole::Admin])),
        )
        .route(
            "/{id}",
            web::patch()
                .to(change_role_by_id)
                .wrap(RequireAuth::allowed_roles(vec![UserRole::Admin])),
        )
}
