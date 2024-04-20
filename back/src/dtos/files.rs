use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct UploadResponseSchema {
    pub path: String,
    pub status: String,
}
