use crate::db::DBClient;
use crate::extractors::auth::Authenticated;
use crate::models::article::ArticleModel;
use async_trait::async_trait;
use slugify::slugify;
use uuid::Uuid;

#[async_trait]
pub trait ArticleExt {
    async fn get_articles_count(&self) -> Result<usize, sqlx::Error>;
    async fn get_article(
        &self,
        article_id: Option<Uuid>,
    ) -> Result<Option<ArticleModel>, sqlx::Error>;
    async fn get_articles(&self, page: u32, limit: usize)
        -> Result<Vec<ArticleModel>, sqlx::Error>;
    async fn save_article<T: Into<String> + Send>(
        &self,
        title: T,
        content: T,
        cover: T,
        author_id: Authenticated,
        tags: Vec<String>,
    ) -> Result<ArticleModel, sqlx::Error>;
    async fn update_article<T: Into<String> + Send>(
        &self,
        article_id: Option<Uuid>,
        title: T,
        content: T,
        cover: T,
        tags: Vec<String>,
    ) -> Result<Option<ArticleModel>, sqlx::Error>;
    async fn delete_article(&self, article_id: Option<Uuid>) -> Result<(), sqlx::Error>;
    async fn get_articles_by_tags(
        &self,
        tags: Vec<String>,
    ) -> Result<Vec<ArticleModel>, sqlx::Error>;
}

#[async_trait]
impl ArticleExt for DBClient {
    async fn get_articles_count(&self) -> Result<usize, sqlx::Error> {
        let result = sqlx::query!(r#"SELECT COUNT(*) as "count!: i64" FROM articles"#)
            .fetch_one(&self.pool)
            .await?;

        Ok(result.count as usize)
    }

    async fn get_article(
        &self,
        article_id: Option<Uuid>,
    ) -> Result<Option<ArticleModel>, sqlx::Error> {
        let mut article: Option<ArticleModel> = None;

        if let Some(article_id) = article_id {
            article = sqlx::query_as!(
                ArticleModel,
                r#"SELECT * FROM articles WHERE id = $1"#,
                article_id
            )
            .fetch_optional(&self.pool)
            .await?;
        }
        Ok(article)
    }

    async fn get_articles(
        &self,
        page: u32,
        limit: usize,
    ) -> Result<Vec<ArticleModel>, sqlx::Error> {
        let offset = (page - 1) * limit as u32;

        let articles = sqlx::query_as!(
            ArticleModel,
            r#"SELECT * FROM articles LIMIT $1 OFFSET $2"#,
            limit as i64,
            offset as i64
        )
        .fetch_all(&self.pool)
        .await?;

        Ok(articles)
    }

    async fn save_article<T: Into<String> + Send>(
        &self,
        title: T,
        content: T,
        cover: T,
        author_id: Authenticated,
        tags: Vec<String>,
    ) -> Result<ArticleModel, sqlx::Error> {
        let title_str = title.into();
        let slug = slugify!(&title_str.clone());
        let now = chrono::Utc::now();

        let article = sqlx::query_as!(
            ArticleModel,
            r#"INSERT INTO articles (title, content, cover, slug, author_id, tags, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, title, content, cover, slug, author_id, tags, created_at, updated_at"#,
            title_str,
            content.into(),
            cover.into(),
            slug,
            author_id.id,
            &tags,
            now
        )
        .fetch_one(&self.pool)
        .await?;

        Ok(article)
    }

    async fn update_article<T: Into<String> + Send>(
        &self,
        article_id: Option<Uuid>,
        title: T,
        content: T,
        cover: T,
        tags: Vec<String>,
    ) -> Result<Option<ArticleModel>, sqlx::Error> {
        let title_str = title.into();
        let slug = slugify!(&title_str.clone());
        let now = chrono::Utc::now();

        if let Some(article_id) = article_id {
            let existing_article = sqlx::query_as!(
                ArticleModel,
                r#"SELECT * FROM articles WHERE id = $1"#,
                article_id
            )
            .fetch_optional(&self.pool)
            .await?;

            if existing_article.is_none() {
                return Err(sqlx::Error::RowNotFound);
            }

            let updated_article = sqlx::query_as!(
                ArticleModel,
                r#"UPDATE articles SET title=$1, content=$2, cover=$3, updated_at=$4, slug=$5, tags=$6 WHERE id=$7 RETURNING id, title, content, cover, slug, author_id, tags, created_at, updated_at"#,
                title_str,
                content.into(),
                cover.into(),
                now,
                slug,
                &tags,
                article_id
            )
            .fetch_optional(&self.pool)
            .await?;

            return Ok(updated_article);
        }

        Err(sqlx::Error::RowNotFound)
    }

    async fn delete_article(&self, article_id: Option<Uuid>) -> Result<(), sqlx::Error> {
        if let Some(article_id) = article_id {
            let deleted_rows = sqlx::query!(r#"DELETE FROM articles WHERE id = $1"#, article_id)
                .execute(&self.pool)
                .await?
                .rows_affected();

            if deleted_rows == 0 {
                return Err(sqlx::Error::RowNotFound);
            }

            return Ok(());
        }

        Err(sqlx::Error::RowNotFound)
    }

    async fn get_articles_by_tags(
        &self,
        tags: Vec<String>,
    ) -> Result<Vec<ArticleModel>, sqlx::Error> {
        let articles = sqlx::query_as!(
            ArticleModel,
            r#"SELECT * FROM articles WHERE tags && $1"#,
            &tags
        )
        .fetch_all(&self.pool)
        .await?;

        Ok(articles)
    }
}
