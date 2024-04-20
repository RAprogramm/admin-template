use crate::{errors::HttpError, extractors::auth::Authenticated, AppState};
use actix_web::{web, HttpResponse};
use log::debug;
use serde_json::json;
use std::path::PathBuf;

#[utoipa::path(
    delete,
    path = "/api/files/{file_path}",
    tag = "Files Endpoints",
    params(
        ("file_path", description = "Unique file name with location on server")
    ),
    responses(
        (status=201, description= "File deleted successfully", body= Response ),
        (status=400, description= "Validation Errors", body= Response),
        (status=500, description= "Internal Server Error", body= Response ),
        (status = 404, description = "File not found", body = Response),
        (status = 403, description = "Forbidden", body = Response),
    ),
    security(
        ("token" = [])
    )
)]
pub async fn delete_file(
    config: web::Data<AppState>,
    user: Authenticated,
    file_path: web::Path<String>,
) -> Result<HttpResponse, HttpError> {
    // Ensure the file path does not traverse directories
    if file_path.contains("..") {
        return Err(HttpError::bad_request("Invalid file path"));
    }

    let storage_path = &config.env.storage_path;
    let full_file_path = PathBuf::from(storage_path).join(file_path.into_inner());
    debug!("PATH FULL{:?}", full_file_path);

    // Verify user permission
    let has_permission = config.db_client.user_permission(user.id).await?;
    if !has_permission {
        return Err(HttpError::forbidden(
            "You do not have permission to delete this file",
        ));
    }

    // Attempt to delete the file
    if full_file_path.exists() && full_file_path.is_file() {
        // Ensure the path is a file
        match std::fs::remove_file(&full_file_path) {
            Ok(_) => Ok(HttpResponse::Ok().json(json!({"message": "File successfully deleted"}))),
            Err(e) => {
                log::error!(
                    "Error deleting file: {}, user_id: {}, file_path: {}",
                    e,
                    user.id,
                    full_file_path.display()
                );
                Err(HttpError::server_error("Error deleting file"))
            }
        }
    } else if !full_file_path.exists() {
        Ok(HttpResponse::NotFound().json(json!({"message": "File not found"})))
    } else {
        // Return an error if the path is not a file (e.g., it's a directory)
        Err(HttpError::bad_request("The specified path is not a file"))
    }
}
