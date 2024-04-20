use std::{ffi::OsStr, path::Path};

use chrono::Utc;
use sanitize_filename::sanitize;

pub fn new_file_name(original_file_name: &str, user_id: &str) -> String {
    // Extract the file extension
    let extension = Path::new(original_file_name)
        .extension()
        .and_then(OsStr::to_str)
        .unwrap_or("");

    let sanitized_extension = if !extension.is_empty() {
        format!(".{}", sanitize(extension))
    } else {
        String::new()
    };

    if original_file_name.len() <= 10 {
        format!(
            "{}-{}-{}{}",
            user_id,
            Utc::now().format("%Y-%m-%d-%H-%M-%S"),
            sanitize(&original_file_name),
            sanitized_extension
        )
    } else {
        let original_file_name_trimmed = original_file_name.chars().take(10).collect::<String>();
        format!(
            "{}-{}-{}{}",
            user_id,
            Utc::now().format("%Y-%m-%d-%H-%M-%S"),
            sanitize(&original_file_name_trimmed),
            sanitized_extension
        )
    }
}
