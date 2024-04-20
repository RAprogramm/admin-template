use crate::{errors::HttpError, extractors::auth::Authenticated, AppState};
use actix_web::{http::header::ContentType, web, HttpResponse};
use log::debug;
use serde_json::json;
use std::path::PathBuf;

#[utoipa::path(
    get,
    path = "/api/files/{file_path}",
    tag = "Files Endpoints",
    params(
        ("file_path", description = "Unique file name with location on server")
    ),
    responses(
        (status=200, description= "File fetched successfully", body= Response ),
        (status=400, description= "Validation Errors", body= Response),
        (status=500, description= "Internal Server Error", body= Response ),
        (status=404, description= "File not found", body= Response),
        (status=403, description= "Forbidden", body= Response),
    ),
    security(
        ("token" = [])
    )
)]
pub async fn fetch_file(
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
    debug!("Fetching file from path: {:?}", full_file_path);

    // Attempt to open and return the file
    if full_file_path.exists() && full_file_path.is_file() {
        // Ensure the path is a file
        let file_contents = std::fs::read(&full_file_path).map_err(|e| {
            log::error!(
                "Error fetching file: {}, user_id: {}, file_path: {}",
                e,
                user.id,
                full_file_path.display()
            );
            HttpError::server_error("Error fetching file")
        })?;

        Ok(HttpResponse::Ok()
            .insert_header(ContentType(
                mime_guess::from_path(&full_file_path).first_or_octet_stream(),
            ))
            .body(file_contents))
    } else if !full_file_path.exists() {
        Ok(HttpResponse::NotFound().json(json!({"message": "File not found"})))
    } else {
        // Return an error if the path is not a file (e.g., it's a directory)
        Err(HttpError::bad_request("The specified path is not a file"))
    }
}
