use super::articles::{
    create::create_article, get_all::all_articles, get_one::get_article, remove::remove_article,
    update::change_article,
};
use crate::{extractors::auth::RequireAuth, models::user::UserRole};
use actix_web::{web, Scope};

pub fn articles_handlers() -> Scope {
    web::scope("/api/articles")
        .route(
            "",
            web::get()
                .to(all_articles)
                .wrap(RequireAuth::allowed_roles(vec![
                    UserRole::User,
                    UserRole::Moderator,
                    UserRole::Admin,
                ])),
        )
        .route(
            "/{id}",
            web::get()
                .to(get_article)
                .wrap(RequireAuth::allowed_roles(vec![
                    UserRole::User,
                    UserRole::Moderator,
                    UserRole::Admin,
                ])),
        )
        .route(
            "/",
            web::post()
                .to(create_article)
                .wrap(RequireAuth::allowed_roles(vec![
                    UserRole::Moderator,
                    UserRole::Admin,
                ])),
        )
        .route(
            "/{id}",
            web::patch()
                .to(change_article)
                .wrap(RequireAuth::allowed_roles(vec![
                    UserRole::Moderator,
                    UserRole::Admin,
                ])),
        )
        .route(
            "/{id}",
            web::delete()
                .to(remove_article)
                .wrap(RequireAuth::allowed_roles(vec![
                    UserRole::Moderator,
                    UserRole::Admin,
                ])),
        )
}
