use crate::{
    database::articles::ArticleExt, dtos::articles::UpdateArticleSchema, errors::HttpError,
    extractors::auth::Authenticated, AppState,
};
use actix_web::{web, HttpResponse};

/// Update article
#[utoipa::path(
    patch,
    path = "/api/articles/{id}",
    tag = "Articles Endpoints",
    request_body(content = UpdateArticleSchema, description = "Data for updating the article", example = json!({"title": "Updated Title","content": "Updated content","cover": "updated_cover.png", "tags": ["updated_tag1", "updated_tag2"] })),
    params(
        ("id" = Uuid, Path, description = "Unique id of the article to update")
    ),
    responses(
        (status = 200, description = "Article updated successfully", body = ArticleResponseSchema),
        (status = 400, description = "Bad Request", body = Response),
        (status = 404, description = "Article not found", body = Response),
        (status = 403, description = "Forbidden", body = Response),
        (status = 500, description = "Internal Server Error", body = Response),
    ),
    security(
        ("token" = [])
    )
)]
pub async fn change_article(
    app_state: web::Data<AppState>,
    article_id: web::Path<uuid::Uuid>,
    body: web::Json<UpdateArticleSchema>,
    user: Authenticated,
) -> Result<HttpResponse, HttpError> {
    let user_id = user.id;

    let has_permission = app_state.db_client.user_permission(user_id).await?;

    if !has_permission {
        return Err(HttpError::forbidden(
            "You do not have permission to delete this article",
        ));
    }

    let update_result = app_state
        .db_client
        .update_article(
            Some(*article_id),
            body.title.clone().unwrap_or_default(),
            body.content.clone().unwrap_or_default(),
            body.cover.clone().unwrap_or_default(),
            body.tags.clone().unwrap_or_default(),
        )
        .await?;

    match update_result {
        Some(article) => Ok(HttpResponse::Ok().json(article)),
        None => Err(HttpError::not_found("Article not found")),
    }
}
