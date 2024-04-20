use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use validator::Validate;

use crate::models::user::UserModel;

#[derive(Validate, Debug, Default, Clone, Serialize, Deserialize, ToSchema)]
pub struct RegisterUserSchema {
    #[validate(length(min = 1, message = "Name is required"))]
    pub name: String,
    #[validate(
        length(min = 1, message = "Email is required"),
        email(message = "Email is invalid")
    )]
    pub email: String,
    #[validate(
        length(min = 1, message = "Password is required"),
        length(min = 6, message = "Password must be at least 6 characters")
    )]
    pub password: String,
    #[validate(
        length(min = 1, message = "Please confirm your password"),
        must_match(other = "password", message = "Passwords do not match")
    )]
    #[serde(rename = "passwordConfirm")]
    pub password_confirm: String,
}

#[derive(Validate, Debug, Default, Clone, Serialize, Deserialize, ToSchema)]
pub struct LoginUserSchema {
    #[validate(
        length(min = 1, message = "Email is required"),
        email(message = "Email is invalid")
    )]
    pub email: String,
    #[validate(
        length(min = 1, message = "Password is required"),
        length(min = 6, message = "Password must be at least 6 characters")
    )]
    pub password: String,
}

#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct FilterUserSchema {
    pub id: String,
    pub name: String,
    pub email: String,
    pub role: String,
    pub verified: bool,
    #[serde(rename = "createdAt")]
    pub created_at: DateTime<Utc>,
    #[serde(rename = "updatedAt")]
    pub updated_at: DateTime<Utc>,
}

impl FilterUserSchema {
    pub fn filter_user(user: &UserModel) -> Self {
        FilterUserSchema {
            id: user.id.to_string(),
            email: user.email.to_owned(),
            name: user.name.to_owned(),
            role: user.role.to_str().to_string(),
            verified: user.verified,
            created_at: user.created_at.unwrap(),
            updated_at: user.updated_at.unwrap(),
        }
    }

    pub fn filter_users(users: &[UserModel]) -> Vec<FilterUserSchema> {
        users.iter().map(FilterUserSchema::filter_user).collect()
    }
}

#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct UserData {
    pub user: FilterUserSchema,
}

#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct UserResponseSchema {
    pub status: String,
    pub data: UserData,
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateUserSchema {
    pub role: Option<String>,
    pub updated_at: Option<DateTime<Utc>>,
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct ChangePasswordSchema {
    pub old_password: String,
    pub new_password: String,
    pub updated_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct UserListResponseSchema {
    pub status: String,
    pub users: Vec<FilterUserSchema>,
    pub results: usize,
    pub total_results: usize,
    pub total_pages: usize,
}

#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct UserLoginResponseSchema {
    pub status: String,
    pub token: String,
}
