use super::projects::{
    create::create_project, get_all::all_projects, get_one::get_project, remove::remove_project,
    update::change_project,
};
use crate::{extractors::auth::RequireAuth, models::user::UserRole};
use actix_web::{web, Scope};

pub fn projects_handlers() -> Scope {
    web::scope("/api/projects")
        .route(
            "",
            web::get()
                .to(all_projects)
                .wrap(RequireAuth::allowed_roles(vec![
                    UserRole::User,
                    UserRole::Moderator,
                    UserRole::Admin,
                ])),
        )
        .route(
            "/{id}",
            web::get()
                .to(get_project)
                .wrap(RequireAuth::allowed_roles(vec![
                    UserRole::User,
                    UserRole::Moderator,
                    UserRole::Admin,
                ])),
        )
        .route(
            "/",
            web::post()
                .to(create_project)
                .wrap(RequireAuth::allowed_roles(vec![
                    UserRole::Moderator,
                    UserRole::Admin,
                ])),
        )
        .route(
            "/{id}",
            web::patch()
                .to(change_project)
                .wrap(RequireAuth::allowed_roles(vec![
                    UserRole::Moderator,
                    UserRole::Admin,
                ])),
        )
        .route(
            "/{id}",
            web::delete()
                .to(remove_project)
                .wrap(RequireAuth::allowed_roles(vec![
                    UserRole::Moderator,
                    UserRole::Admin,
                ])),
        )
}
