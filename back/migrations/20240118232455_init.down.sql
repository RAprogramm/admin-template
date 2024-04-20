DROP INDEX IF EXISTS users_name_idx;
DROP INDEX IF EXISTS users_email_idx;
DROP INDEX IF EXISTS articles_author_idx;
DROP INDEX IF EXISTS articles_slug_idx;
DROP INDEX IF EXISTS projects_slug_idx;
DROP INDEX IF EXISTS projects_tags_idx;
DROP INDEX IF EXISTS articles_tags_idx;

DROP FUNCTION IF EXISTS get_articles_by_tags(TEXT[]);
DROP FUNCTION IF EXISTS get_projects_by_tags(TEXT[]);

DROP TABLE IF EXISTS "articles";
DROP TABLE IF EXISTS "projects";
DROP TABLE IF EXISTS "users";

DROP TYPE IF EXISTS user_role;

DROP EXTENSION IF EXISTS "uuid-ossp";
