use actix_web::{web, HttpResponse};
use validator::Validate;

use crate::{
    database::articles::ArticleExt,
    dtos::{
        articles::{ArticlesListResponseSchema, FilterArticleSchema},
        common::RequestQuerySchema,
    },
    errors::HttpError,
    AppState,
};

/// All articles
#[utoipa::path(
    get,
    path = "/api/articles",
    tag = "Articles Endpoints",
    params(RequestQuerySchema),
    responses(
        (status = 200, description= "All Articles", body = [ArticlesListResponseSchema]),
        (status=401, description= "Authentication Error", body= Response),
        (status=403, description= "Permission Denied Error", body= Response),
        (status= 500, description= "Internal Server Error", body = Response )
       
    ),
    security(
        ("token" = [])
    )
)]
pub async fn all_articles(
    query: web::Query<RequestQuerySchema>,
    app_state: web::Data<AppState>,
) -> Result<HttpResponse, HttpError> {
    let query_params: RequestQuerySchema = query.into_inner();

    query_params
        .validate()
        .map_err(|e| HttpError::bad_request(e.to_string()))?;

    let page = query_params.page.unwrap_or(1);
    let limit = query_params.limit.unwrap_or(10);

    let tags = match query_params.tags {
        Some(tags_str) => {
            let tags_vec: Vec<String> = tags_str.split(',').map(|s| s.trim().to_string()).collect();
            Some(tags_vec)
        }
        None => None,
    };

    let (total_articles, articles) = if let Some(tags) = &tags {
        let articles = app_state
            .db_client
            .get_articles_by_tags(tags.clone())
            .await
            .map_err(|e| HttpError::server_error(e.to_string()))?;
        (articles.len(), articles)
    } else {
        let total_articles = app_state
            .db_client
            .get_articles_count()
            .await
            .map_err(|e| HttpError::server_error(e.to_string()))?;
        let articles = app_state
            .db_client
            .get_articles(page as u32, limit)
            .await
            .map_err(|e| HttpError::server_error(e.to_string()))?;
        (total_articles, articles)
    };

    Ok(HttpResponse::Ok().json(ArticlesListResponseSchema {
        status: "success".to_string(),
        articles: FilterArticleSchema::filter_articles(&articles),
        results: articles.len(),
        total_results: total_articles,
        total_pages: (total_articles as f64 / limit as f64).ceil() as usize,
    }))
}
