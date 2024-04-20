use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use validator::Validate;

use crate::models::article::ArticleModel;

#[derive(Validate, Debug, Default, Clone, Serialize, Deserialize, ToSchema)]
pub struct CreateArticleSchema {
    #[validate(length(min = 1, message = "Title is required"))]
    pub title: String,
    #[validate(length(min = 1, message = "Content is required"))]
    pub content: String,
    #[validate(length(min = 1, message = "Cover is required"))]
    pub cover: String,
    #[validate(length(min = 1, message = "Tags are required"))]
    pub tags: Vec<String>,
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateArticleSchema {
    pub title: Option<String>,
    pub content: Option<String>,
    pub cover: Option<String>,
    pub tags: Option<Vec<String>>,
    pub updated_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct FilterArticleSchema {
    pub id: String,
    pub title: String,
    pub content: String,
    pub author_id: String,
    pub cover: String,
    pub slug: String,
    pub tags: Vec<String>,
    #[serde(rename = "createdAt")]
    pub created_at: DateTime<Utc>,
    #[serde(rename = "updatedAt")]
    pub updated_at: DateTime<Utc>,
}

impl FilterArticleSchema {
    pub fn filter_article(article: &ArticleModel) -> Self {
        FilterArticleSchema {
            id: article.id.to_string(),
            title: article.title.to_owned(),
            content: article.content.to_owned(),
            cover: article.cover.to_string(),
            author_id: article.author_id.to_string(),
            slug: article.slug.to_string(),
            tags: article.tags.clone(),
            created_at: article.created_at.unwrap(),
            updated_at: article.updated_at.unwrap(),
        }
    }

    pub fn filter_articles(articles: &[ArticleModel]) -> Vec<FilterArticleSchema> {
        articles
            .iter()
            .map(FilterArticleSchema::filter_article)
            .collect()
    }
}

#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct ArticleData {
    pub article: FilterArticleSchema,
}

#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct ArticleResponseSchema {
    pub status: String,
    pub data: ArticleData,
}

#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct ArticlesListResponseSchema {
    pub status: String,
    pub articles: Vec<FilterArticleSchema>,
    pub results: usize,
    pub total_results: usize,
    pub total_pages: usize,
}
