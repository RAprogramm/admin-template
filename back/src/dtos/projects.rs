use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use validator::Validate;

use crate::models::project::ProjectModel;

#[derive(Validate, Debug, Default, Clone, Serialize, Deserialize, ToSchema)]
pub struct CreateProjectSchema {
    #[validate(length(min = 1, message = "Title is required"))]
    pub title: String,
    #[validate(length(min = 1, message = "Description is required"))]
    pub description: String,
    #[validate(length(min = 1, message = "Cover is required"))]
    pub cover: String,
    #[validate(length(min = 1, message = "Category is required"))]
    pub category: String,
    #[validate(length(min = 1, message = "Tags are required"))]
    pub tags: Vec<String>,
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct UpdateProjectSchema {
    pub title: Option<String>,
    pub description: Option<String>,
    pub cover: Option<String>,
    pub category: Option<String>,
    pub tags: Option<Vec<String>>,
    pub updated_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct FilterProjectSchema {
    pub id: String,
    pub title: String,
    pub description: String,
    pub slug: String,
    pub cover: String,
    pub category: String,
    pub tags: Vec<String>,
    #[serde(rename = "createdAt")]
    pub created_at: DateTime<Utc>,
    #[serde(rename = "updatedAt")]
    pub updated_at: DateTime<Utc>,
}

impl FilterProjectSchema {
    pub fn filter_project(project: &ProjectModel) -> Self {
        FilterProjectSchema {
            id: project.id.to_string(),
            title: project.title.to_owned(),
            description: project.description.to_owned(),
            slug: project.slug.to_string(),
            cover: project.cover.to_string(),
            category: project.category.to_string(),
            tags: project.tags.clone(),
            created_at: project.created_at.unwrap(),
            updated_at: project.updated_at.unwrap(),
        }
    }

    pub fn filter_projects(projects: &[ProjectModel]) -> Vec<FilterProjectSchema> {
        projects
            .iter()
            .map(FilterProjectSchema::filter_project)
            .collect()
    }
}

#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct ProjectData {
    pub project: FilterProjectSchema,
}

#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct ProjectResponseSchema {
    pub status: String,
    pub data: ProjectData,
}

#[derive(Debug, Serialize, Deserialize, ToSchema)]
pub struct ProjectsListResponseSchema {
    pub status: String,
    pub projects: Vec<FilterProjectSchema>,
    pub results: usize,
    pub total_results: usize,
    pub total_pages: usize,
}
