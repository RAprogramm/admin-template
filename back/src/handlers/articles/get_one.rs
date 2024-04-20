use actix_web::{web, HttpResponse};

use crate::{
    database::articles::ArticleExt,
    dtos::articles::{ArticleData, ArticleResponseSchema, FilterArticleSchema},
    errors::HttpError,
    AppState,
};

/// Get article
#[utoipa::path(
    get,
    path = "/api/articles/{id}",
    tag = "Articles Endpoints",
    params(
        ("id", description = "Unique storage id of Article")
    ),
    responses(
        (status = 204, description = "Article was found", body= ArticleResponseSchema),
        (status = 400, description = "Bad Request", body = Response),
        (status = 404, description = "Article not found", body = Response),
        (status = 403, description = "Forbidden", body = Response),
        (status = 500, description = "Internal Server Error", body = Response),
    ),
    security(
        ("token" = [])
    )
)]
pub async fn get_article(
    app_state: web::Data<AppState>,
    article_id: web::Path<uuid::Uuid>,
) -> Result<HttpResponse, HttpError> {
    let article = app_state
        .db_client
        .get_article(Some(*article_id))
        .await?
        .ok_or(HttpError::not_found("Article not found"))?;

    let filtered_article = FilterArticleSchema::filter_article(&article);

    let response_data = ArticleResponseSchema {
        status: "success".to_string(),
        data: ArticleData {
            article: filtered_article,
        },
    };

    Ok(HttpResponse::Ok().json(response_data))
}
