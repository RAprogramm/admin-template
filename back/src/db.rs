use crate::models::user::{UserModel, UserRole};
use sqlx::Error;
use sqlx::{Pool, Postgres};
use uuid::Uuid;

#[derive(Debug, Clone)]
pub struct DBClient {
    pub pool: Pool<Postgres>,
}

impl DBClient {
    pub fn new(pool: Pool<Postgres>) -> Self {
        DBClient { pool }
    }

    pub async fn user_permission(&self, user_id: Uuid) -> Result<bool, Error> {
        // Get user info
        let user = sqlx::query_as!(UserModel, r#"SELECT id,name,email,password,verified,created_at,updated_at,role as "role: UserRole" FROM users WHERE id = $1"#, user_id)
            .fetch_optional(&self.pool)
            .await?
            .ok_or_else(|| Error::RowNotFound)?;

        // Is admin or moderator
        match user.role {
            UserRole::Admin | UserRole::Moderator => Ok(true),
            _ => Ok(false),
        }
    }
}
