use crate::{
    database::users::UserExt,
    dtos::users::{FilterUserSchema, RegisterUserSchema, UserData, UserResponseSchema},
    errors::{ErrorMessage, HttpError},
    utils::password,
    AppState,
};
use actix_web::{web, HttpResponse};
use sqlx::Error;
use validator::Validate;

/// Register a new user
#[utoipa::path(
    post,
    path = "/api/auth/register",
    tag = "Auth Endpoints",
    request_body(content = RegisterUserSchema, description = "Credentials to create account", example = json!({"email": "johndoe@example.com","name": "John Doe","password": "password123","passwordConfirm": "password123"})),
    responses(
        (status=201, description= "Account created successfully", body= UserResponseSchema ),
        (status=400, description= "Validation Errors", body= Response),
        (status=409, description= "User with email already exists", body= Response),
        (status=500, description= "Internal Server Error", body= Response ),
    )
)]
pub async fn register(
    app_state: web::Data<AppState>,
    body: web::Json<RegisterUserSchema>,
) -> Result<HttpResponse, HttpError> {
    body.validate()
        .map_err(|e| HttpError::bad_request(e.to_string()))?;

    let hashed_password =
        password::hash(&body.password).map_err(|e| HttpError::server_error(e.to_string()))?;

    let result = app_state
        .db_client
        .save_user(&body.name, &body.email, &hashed_password)
        .await;

    match result {
        Ok(user) => Ok(HttpResponse::Created().json(UserResponseSchema {
            status: "success".to_string(),
            data: UserData {
                user: FilterUserSchema::filter_user(&user),
            },
        })),
        Err(Error::Database(db_err)) => {
            if db_err.is_unique_violation() {
                Err(HttpError::unique_constraint_voilation(
                    ErrorMessage::EmailExist,
                ))
            } else {
                Err(HttpError::server_error(db_err.to_string()))
            }
        }
        Err(e) => Err(HttpError::server_error(e.to_string())),
    }
}
