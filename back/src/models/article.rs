use chrono::prelude::*;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Deserialize, sqlx::FromRow, Serialize, Clone)]
pub struct ArticleModel {
    pub id: Uuid,
    pub title: String,
    pub content: String,
    pub cover: String,
    pub slug: String,
    pub author_id: Uuid,
    pub tags: Vec<String>,
    #[serde(rename = "createdAt")]
    pub created_at: Option<DateTime<Utc>>,
    #[serde(rename = "updatedAt")]
    pub updated_at: Option<DateTime<Utc>>,
}
