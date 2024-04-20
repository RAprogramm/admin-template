use serde::{Deserialize, Serialize};
use utoipa::{IntoParams, ToSchema};
use validator::Validate;

#[derive(Serialize, Deserialize, Validate, IntoParams)]
pub struct RequestQuerySchema {
    /// Page number (optional)
    #[validate(range(min = 1))]
    pub page: Option<usize>,
    /// Items limit on page (optional)
    #[validate(range(min = 1, max = 50))]
    pub limit: Option<usize>,
    /// Tags in items (optional)
    #[validate(length(min = 1))]
    pub tags: Option<String>,
}

#[derive(Serialize, Deserialize, ToSchema)]
pub struct Response {
    pub status: &'static str,
    pub message: String,
}
