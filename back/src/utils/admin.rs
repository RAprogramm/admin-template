use std::env;

use dotenv::dotenv;

use super::password::hash;

async fn admin_exists(pool: &sqlx::Pool<sqlx::Postgres>) -> Result<bool, sqlx::Error> {
    let (exists,) = sqlx::query_as::<_, (bool,)>(
        r#"
        SELECT EXISTS (
            SELECT 1 FROM users WHERE role = 'admin'
        )
    "#,
    )
    .fetch_one(pool)
    .await?;

    Ok(exists)
}

pub async fn create_admin_if_not_exists(
    pool: &sqlx::Pool<sqlx::Postgres>,
) -> Result<(), sqlx::Error> {
    if !admin_exists(pool).await? {
        dotenv().ok();

        let admin_name = env::var("ADMIN_NAME").expect("ADMIN_NAME must be set");
        let admin_email = env::var("ADMIN_EMAIL").expect("ADMIN_EMAIL must be set");
        let admin_password = env::var("ADMIN_PASSWORD").expect("ADMIN_PASSWORD must be set");
        let hashed_password = hash(&admin_password).expect("Failed to hash password");

        sqlx::query!(
            r#"
            INSERT INTO users (name, email, password, verified, role)
            VALUES ($1, $2, $3, TRUE, 'admin')
        "#,
            admin_name,
            admin_email,
            hashed_password
        )
        .execute(pool)
        .await?;
    }

    Ok(())
}
