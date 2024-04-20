use actix_multipart::form::{tempfile::TempFile, MultipartForm};

#[derive(MultipartForm)]
pub struct FileModel {
    pub file: TempFile,
}
