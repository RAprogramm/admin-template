use crate::{
    database::articles::ArticleExt, errors::HttpError, extractors::auth::Authenticated, AppState,
};
use actix_web::{web, HttpResponse};

/// Delete article
#[utoipa::path(
    delete,
    path = "/api/articles/{id}",
    tag = "Articles Endpoints",
    params(
        ("id", description = "Unique storage id of Article")
    ),
    responses(
        (status = 204, description = "Article deleted successfully"),
        (status = 400, description = "Bad Request", body = Response),
        (status = 404, description = "Article not found", body = Response),
        (status = 403, description = "Forbidden", body = Response),
        (status = 500, description = "Internal Server Error", body = Response),
    ),
    security(
        ("token" = [])
    )
)]
pub async fn remove_article(
    app_state: web::Data<AppState>,
    article_id: web::Path<uuid::Uuid>,
    user: Authenticated,
) -> Result<HttpResponse, HttpError> {
    let user_id = user.id;

    let has_permission = app_state.db_client.user_permission(user_id).await?;

    if !has_permission {
        return Err(HttpError::forbidden(
            "You do not have permission to delete this article",
        ));
    }

    app_state
        .db_client
        .delete_article(Some(*article_id))
        .await?;

    Ok(HttpResponse::NoContent().finish())
}
