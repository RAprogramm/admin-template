use crate::db::DBClient;
use crate::models::project::ProjectModel;
use async_trait::async_trait;
use slugify::slugify;
use uuid::Uuid;

#[async_trait]
pub trait ProjectExt {
    async fn get_projects_count(&self) -> Result<usize, sqlx::Error>;
    async fn get_project(
        &self,
        project_id: Option<Uuid>,
    ) -> Result<Option<ProjectModel>, sqlx::Error>;
    async fn get_projects(&self, page: u32, limit: usize)
        -> Result<Vec<ProjectModel>, sqlx::Error>;
    async fn get_projects_by_tags(
        &self,
        tags: Vec<String>,
    ) -> Result<Vec<ProjectModel>, sqlx::Error>;
    async fn save_project<T: Into<String> + Send>(
        &self,
        title: T,
        description: T,
        cover: T,
        category: T,
        tags: Vec<String>,
    ) -> Result<ProjectModel, sqlx::Error>;
    async fn update_project<T: Into<String> + Send>(
        &self,
        project_id: Option<Uuid>,
        title: T,
        description: T,
        category: T,
        cover: T,
        tags: Vec<String>,
    ) -> Result<Option<ProjectModel>, sqlx::Error>;
    async fn delete_project(&self, project_id: Option<Uuid>) -> Result<(), sqlx::Error>;
}

#[async_trait]
impl ProjectExt for DBClient {
    async fn get_projects_count(&self) -> Result<usize, sqlx::Error> {
        let result = sqlx::query!(r#"SELECT COUNT(*) as "count!: i64" FROM projects"#)
            .fetch_one(&self.pool)
            .await?;

        Ok(result.count as usize)
    }

    async fn get_project(
        &self,
        project_id: Option<Uuid>,
    ) -> Result<Option<ProjectModel>, sqlx::Error> {
        let mut project: Option<ProjectModel> = None;

        if let Some(project_id) = project_id {
            project = sqlx::query_as!(
                ProjectModel,
                r#"SELECT * FROM projects WHERE id = $1"#,
                project_id
            )
            .fetch_optional(&self.pool)
            .await?;
        }
        Ok(project)
    }

    async fn get_projects(
        &self,
        page: u32,
        limit: usize,
    ) -> Result<Vec<ProjectModel>, sqlx::Error> {
        let offset = (page - 1) * limit as u32;

        let projects = sqlx::query_as!(
            ProjectModel,
            r#"SELECT * FROM projects LIMIT $1 OFFSET $2"#,
            limit as i64,
            offset as i64
        )
        .fetch_all(&self.pool)
        .await?;

        Ok(projects)
    }

    async fn save_project<T: Into<String> + Send>(
        &self,
        title: T,
        description: T,
        cover: T,
        category: T,
        tags: Vec<String>,
    ) -> Result<ProjectModel, sqlx::Error> {
        let title_str = title.into();
        let slug = slugify!(&title_str.clone());
        let now = chrono::Utc::now();

        let project = sqlx::query_as!(
            ProjectModel,
            r#"INSERT INTO projects (title, description, cover, slug, tags, created_at, category) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, title, description, cover, category, slug, tags, created_at, updated_at"#,
            title_str,
            description.into(),
            cover.into(),
            slug,
            &tags,
            now,
            category.into()
        )
        .fetch_one(&self.pool)
        .await?;

        Ok(project)
    }

    async fn update_project<T: Into<String> + Send>(
        &self,
        project_id: Option<Uuid>,
        title: T,
        description: T,
        category: T,
        cover: T,
        tags: Vec<String>,
    ) -> Result<Option<ProjectModel>, sqlx::Error> {
        let title_str = title.into();
        let slug = slugify!(&title_str.clone());
        let now = chrono::Utc::now();

        if let Some(project_id) = project_id {
            let existing_project = sqlx::query_as!(
                ProjectModel,
                r#"SELECT * FROM projects WHERE id = $1"#,
                project_id
            )
            .fetch_optional(&self.pool)
            .await?;

            if existing_project.is_none() {
                return Err(sqlx::Error::RowNotFound);
            }

            let updated_project = sqlx::query_as!(
                ProjectModel,
                r#"UPDATE projects SET title = $1, description = $2, cover = $3, updated_at = $4, slug = $5, category = $6, tags = $7 WHERE id = $8 RETURNING id, title, description, cover, slug, category, tags, created_at, updated_at"#,
                title_str,
                description.into(),
                cover.into(),
                now,
                slug,
                category.into(),
                &tags,
                project_id
            )
            .fetch_optional(&self.pool)
            .await?;

            return Ok(updated_project);
        }

        Err(sqlx::Error::RowNotFound)
    }

    async fn delete_project(&self, project_id: Option<Uuid>) -> Result<(), sqlx::Error> {
        if let Some(project_id) = project_id {
            let deleted_rows = sqlx::query!(r#"DELETE FROM projects WHERE id = $1"#, project_id)
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

    async fn get_projects_by_tags(
        &self,
        tags: Vec<String>,
    ) -> Result<Vec<ProjectModel>, sqlx::Error> {
        let projects = sqlx::query_as!(
            ProjectModel,
            r#"SELECT * FROM projects WHERE tags && $1"#,
            &tags
        )
        .fetch_all(&self.pool)
        .await?;

        Ok(projects)
    }
}
