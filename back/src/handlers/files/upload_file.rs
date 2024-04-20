use actix_multipart::form::MultipartForm;
use actix_web::{web, HttpResponse, Responder};
use std::path::PathBuf;

use crate::{
    extractors::auth::Authenticated, models::file::FileModel, utils::file_name::new_file_name,
    AppState,
};

#[utoipa::path(
    post,
    path = "/api/files",
    tag = "Files Endpoints",
    responses(
        (status=201, description= "File upload successfully", body= Response ),
        (status=400, description= "Validation Errors", body= Response),
        (status=500, description= "Internal Server Error", body= Response ),
    ),
    security(
        ("token" = [])
    )
)]
pub async fn post_file(
    config: web::Data<AppState>,
    form: MultipartForm<FileModel>,
    user: Authenticated,
) -> impl Responder {
    const MAX_FILE_SIZE: u64 = 1024 * 1024 * 4; // 4 MB

    match form.file.size {
        0 => return HttpResponse::BadRequest().finish(),
        length if length > MAX_FILE_SIZE as usize => {
            return HttpResponse::BadRequest().body(format!(
                "The uploaded file is too large. Maximum size is {} bytes.",
                MAX_FILE_SIZE
            ));
        }
        _ => {}
    };

    let temp_file_path = form.file.file.path();
    let file_name: &str = form
        .file
        .file_name
        .as_ref()
        .map(|m| m.as_ref())
        .unwrap_or("null");

    let new_file_name = new_file_name(file_name, &user.id.to_string());

    let mut file_path = PathBuf::from(&config.env.storage_path);

    if !file_path.exists() {
        if let Err(err) = std::fs::create_dir_all(&file_path) {
            log::error!("Failed to create directory: {}", err);
            return HttpResponse::InternalServerError().body(format!("Server error: {}", err));
        }
    }

    file_path.push(new_file_name);

    match std::fs::copy(temp_file_path, &file_path) {
        Ok(_) => {
            let _ = std::fs::remove_file(temp_file_path);
            HttpResponse::Ok().json(&format!("{{\"file_path\": \"{}\"}}", file_path.display()))
        }
        Err(e) => {
            log::error!("File copy error: {}", e);
            HttpResponse::InternalServerError().body(format!("Server error: {}", e))
        }
    }
}
