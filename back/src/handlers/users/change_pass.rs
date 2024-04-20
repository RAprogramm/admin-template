use actix_web::{web, HttpResponse};

use crate::errors::ErrorMessage;
use crate::utils::password;
use crate::{
    database::users::UserExt, dtos::users::ChangePasswordSchema, errors::HttpError,
    extractors::auth::Authenticated, AppState,
};

/// Change user password
#[utoipa::path(
    patch,
    path = "/api/users/pass",
    tag = "Users Endpoints",
    request_body(content = ChangePasswordSchema, description = "Data for updating password", example = json!({"old_password": "oldsecretpassword","new_password": "newsecretpassword"})),
    responses(
        (status = 200, description= "Updated password", body = Response),
        (status= 500, description= "Internal Server Error", body = Response )
       
    ),
    security(
       ("token" = [])
   )
)]
pub async fn change_pass(
    app_state: web::Data<AppState>,
    user: Authenticated,
    body: web::Json<ChangePasswordSchema>,
) -> Result<HttpResponse, HttpError> {
    let user_id = user.id;

    let password_matches = password::compare(&body.old_password, &user.password)
        .map_err(|_| HttpError::unauthorized(ErrorMessage::WrongCredentials))?;
    log::debug!("passwords matching: {:?}", password_matches);

    if password_matches {
        // Hash the new password
        let hashed_password = password::hash(&body.new_password)
            .map_err(|e| HttpError::server_error(e.to_string()))?;

        // Update the password in the database
        match app_state
            .db_client
            .change_password(user_id, &hashed_password)
            .await
        {
            Ok(_) => Ok(HttpResponse::Ok().finish()),
            Err(err) => Err(HttpError::server_error(format!(
                "Failed to change password: {}",
                err
            ))),
        }
    } else {
        Err(HttpError::unauthorized(ErrorMessage::WrongCredentials))
    }

}
