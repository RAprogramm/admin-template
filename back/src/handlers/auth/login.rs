use crate::{
    database::users::UserExt,
    dtos::users::{LoginUserSchema, UserLoginResponseSchema},
    errors::{ErrorMessage, HttpError},
    utils::{password, token},
    AppState,
};
use actix_web::{
    cookie::{time::Duration as ActixWebDuration, Cookie, SameSite},
    web, HttpResponse,
};
use validator::Validate;

/// Login user to system
#[utoipa::path(
    post,
    path = "/api/auth/login",
    tag = "Auth Endpoints",
    request_body(content = LoginUserSchema, description = "Credentials to log in to your account", example = json!({"email": "johndoe@example.com","password": "password123"})),
    responses(
        (status=200, description= "Login successfull", body= UserLoginResponseSchema ),
        (status=400, description= "Validation Errors", body= Response ),
        (status=500, description= "Internal Server Error", body= Response ),
    )
)]
pub async fn login(
    app_state: web::Data<AppState>,
    body: web::Json<LoginUserSchema>,
) -> Result<HttpResponse, HttpError> {
    body.validate()
        .map_err(|e| HttpError::bad_request(e.to_string()))?;

    let result = app_state
        .db_client
        .get_user(None, None, Some(&body.email))
        .await
        .map_err(|e| HttpError::server_error(e.to_string()))?;

    let user = result.ok_or(HttpError::unauthorized(ErrorMessage::WrongCredentials))?;

    let password_matches = password::compare(&body.password, &user.password)
        .map_err(|_| HttpError::unauthorized(ErrorMessage::WrongCredentials))?;

    if password_matches {
        let token = token::create_token(
            &user.id.to_string(),
            app_state.env.jwt_secret.as_bytes(),
            app_state.env.jwt_maxage,
        )
        .map_err(|e| HttpError::server_error(e.to_string()))?;
        let cookie = Cookie::build("token", token.to_owned())
            .path("/")
            .max_age(ActixWebDuration::new(60 * &app_state.env.jwt_maxage, 0))
            // .http_only(true)
            .secure(true) // uncomment in production mode with HTTPS
            .same_site(SameSite::Lax)
            .finish();

        Ok(HttpResponse::Ok()
            .cookie(cookie)
            .json(UserLoginResponseSchema {
                status: "success".to_string(),
                token,
            }))
    } else {
        Err(HttpError::unauthorized(ErrorMessage::WrongCredentials))
    }
}
