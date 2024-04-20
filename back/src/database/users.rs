use crate::db::DBClient;
use crate::models::user::{UserModel, UserRole};
use async_trait::async_trait;
use sqlx::Error;
use uuid::Uuid;

#[async_trait]
pub trait UserExt {
    async fn get_users_count(&self) -> Result<usize, sqlx::Error>;
    async fn get_user(
        &self,
        user_id: Option<Uuid>,
        name: Option<&str>,
        email: Option<&str>,
    ) -> Result<Option<UserModel>, Error>;
    async fn update_user<T: Into<String> + Send>(
        &self,
        user_id: Option<Uuid>,
        role: T,
    ) -> Result<Option<UserModel>, Error>;
    async fn get_users(&self, page: u32, limit: usize) -> Result<Vec<UserModel>, Error>;
    async fn save_user<T: Into<String> + Send>(
        &self,
        name: T,
        email: T,
        password: T,
    ) -> Result<UserModel, Error>;
    async fn change_password(&self, user_id: Uuid, new_password: &str) -> Result<(), sqlx::Error>;
    async fn delete_user(&self, user_id: Option<Uuid>) -> Result<(), sqlx::Error>;
}

#[async_trait]
impl UserExt for DBClient {
    async fn get_users_count(&self) -> Result<usize, sqlx::Error> {
        let result = sqlx::query!(r#"SELECT COUNT(*) as "count!: i64" FROM users"#)
            .fetch_one(&self.pool)
            .await?;

        Ok(result.count as usize)
    }

    async fn update_user<T: Into<String> + Send>(
        &self,
        user_id: Option<Uuid>,
        role: T,
    ) -> Result<Option<UserModel>, Error> {
        let now = chrono::Utc::now();

        if let Some(user_id) = user_id {
            let existing_user = sqlx::query_as!(
                UserModel,
                r#"SELECT id,name,email,password,verified,created_at,updated_at,role as "role: UserRole" FROM users WHERE id = $1"#,
                user_id
            )
            .fetch_optional(&self.pool)
            .await?;

            if existing_user.is_none() {
                return Err(Error::RowNotFound);
            }

            let updated_user = sqlx::query_as!(
                UserModel,
                r#"UPDATE users SET role=($1::text)::user_role, updated_at=$2 WHERE id=$3 RETURNING id, name, email, verified, created_at, password, updated_at, role as "role:UserRole""#,
                role.into(),
                now,
                user_id,
            )
            .fetch_optional(&self.pool)
            .await?;

            return Ok(updated_user);
        }

        Err(sqlx::Error::RowNotFound)
    }

    async fn get_user(
        &self,
        user_id: Option<Uuid>,
        user_name: Option<&str>,
        user_email: Option<&str>,
    ) -> Result<Option<UserModel>, Error> {
        let mut user: Option<UserModel> = None;

        if let Some(user_id) = user_id {
            user = sqlx::query_as!(UserModel, r#"SELECT id,name, email, password,verified,created_at,updated_at,role as "role: UserRole" FROM users WHERE id = $1"#, user_id)
                .fetch_optional(&self.pool)
                .await?;
        } else if let Some(name) = user_name {
            user = sqlx::query_as!(UserModel, r#"SELECT id,name, email, password,verified,created_at,updated_at,role as "role: UserRole" FROM users WHERE name = $1"#, name)
                .fetch_optional(&self.pool)
                .await?;
        } else if let Some(email) = user_email {
            user = sqlx::query_as!(UserModel, r#"SELECT id,name, email, password,verified,created_at,updated_at,role as "role: UserRole" FROM users WHERE email = $1"#, email)
                .fetch_optional(&self.pool)
                .await?;
        }

        Ok(user)
    }

    async fn get_users(&self, page: u32, limit: usize) -> Result<Vec<UserModel>, Error> {
        let offset = (page - 1) * limit as u32;

        let users = sqlx::query_as!(
            UserModel,
            r#"SELECT id, name, email, password, verified, created_at, updated_at, role as "role: UserRole" FROM users WHERE role != 'admin' LIMIT $1 OFFSET $2"#,
            limit as i64,
            offset as i64
        )
        .fetch_all(&self.pool)
        .await?;

        Ok(users)
    }

    async fn save_user<T: Into<String> + Send>(
        &self,
        name: T,
        email: T,
        password: T,
    ) -> Result<UserModel, Error> {
        let user = sqlx::query_as!(
            UserModel,
            r#"INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id,name, email, password,verified,created_at,updated_at,role as "role: UserRole""#,
            name.into(),
            email.into(),
            password.into()
        )
        .fetch_one(&self.pool)
        .await?;

        Ok(user)
    }

    async fn delete_user(&self, user_id: Option<Uuid>) -> Result<(), sqlx::Error> {
        if let Some(user_id) = user_id {
            let deleted_rows = sqlx::query!(r#"DELETE FROM users WHERE id = $1"#, user_id)
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

    async fn change_password(&self, user_id: Uuid, new_password: &str) -> Result<(), sqlx::Error> {
        let now = chrono::Utc::now();

        let _ = sqlx::query!(
            r#"UPDATE users SET password = $1, updated_at = $2 WHERE id = $3"#,
            new_password,
            now,
            user_id,
        )
        .execute(&self.pool)
        .await?;

        Ok(())
    }
}
