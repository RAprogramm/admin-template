use std::env::var;

#[derive(Debug, Clone)]
pub struct Config {
    pub environment: String,
    pub log_level: String,
    pub back_url: String,
    pub back_port: String,
    pub front_url: String,
    pub front_port: String,
    pub storage_path: String,
    pub database_url: String,
    pub jwt_secret: String,
    pub jwt_maxage: i64,
    pub port: u16,
}

impl Config {
    pub fn init() -> Config {
        let environment = var("ENVIRONMENT").expect("ENVIRONMENT must be set");
        let log_level = var("LOG_LEVEL").expect("LOG_LEVEL must be set");
        let back_url = var("BACK_URL").expect("BACK_URL must be set");
        let back_port = var("BACK_PORT").expect("BACK_PORT must be set");
        let front_url = var("FRONT_URL").expect("FRONT_URL must be set");
        let front_port = var("FRONT_PORT").expect("FRONT_PORT must be set");
        let storage_path = var("STORAGE_PATH").expect("STORAGE_PATH must be set");
        let database_url = var("DATABASE_URL").expect("DATABASE_URL must be set");
        let jwt_secret = var("JWT_SECRET_KEY").expect("JWT_SECRET_KEY must be set");
        let jwt_maxage = var("JWT_MAXAGE").expect("JWT_MAXAGE must be set");

        Config {
            environment,
            log_level,
            back_url,
            back_port,
            front_url,
            front_port,
            storage_path,
            database_url,
            jwt_secret,
            jwt_maxage: jwt_maxage.parse::<i64>().unwrap(),
            port: 8000,
        }
    }
}
