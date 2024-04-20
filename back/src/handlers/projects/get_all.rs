use actix_web::{web, HttpResponse};
use validator::Validate;

use crate::{
    database::projects::ProjectExt,
    dtos::{projects::{FilterProjectSchema, ProjectsListResponseSchema}, common::RequestQuerySchema},
    errors::HttpError,
    AppState,
};

/// All projects
#[utoipa::path(
    get,
    path = "/api/projects",
    tag = "Projects Endpoints",
    params(RequestQuerySchema),
    responses(
        (status = 200, description= "All projects", body = [ProjectListResponseSchema]),
        (status=401, description= "Authentication Error", body= Response),
        (status=403, description= "Permission Denied Error", body= Response),
        (status= 500, description= "Internal Server Error", body = Response )
       
    ),
    security(
        ("token" = [])
    )
)]
pub async fn all_projects(
    query: web::Query<RequestQuerySchema>,
    app_state: web::Data<AppState>,
) -> Result<HttpResponse, HttpError> {
    let query_params: RequestQuerySchema = query.into_inner();

    query_params
        .validate()
        .map_err(|e| HttpError::bad_request(e.to_string()))?;

    let page = query_params.page.unwrap_or(1);
    let limit = query_params.limit.unwrap_or(10);

    let tags = match query_params.tags {
        Some(tags_str) => {
            let tags_vec: Vec<String> = tags_str.split(',').map(|s| s.trim().to_string()).collect();
            Some(tags_vec)
        },
        None => None,
    };

    let (total_projects, projects) = if let Some(tags) = &tags {
        let projects = app_state
            .db_client
            .get_projects_by_tags(tags.clone())
            .await
            .map_err(|e| HttpError::server_error(e.to_string()))?;
        (projects.len(), projects)
    } else {
        let total_projects = app_state
            .db_client
            .get_projects_count()
            .await
            .map_err(|e| HttpError::server_error(e.to_string()))?;
        let projects = app_state
            .db_client
            .get_projects(page as u32, limit)
            .await
            .map_err(|e| HttpError::server_error(e.to_string()))?;
        (total_projects, projects)
    };

    Ok(HttpResponse::Ok().json(ProjectsListResponseSchema {
        status: "success".to_string(),
        projects: FilterProjectSchema::filter_projects(&projects),
        results: projects.len(),
        total_results: total_projects,
        total_pages: (total_projects as f64 / limit as f64).ceil() as usize,
    }))
}

