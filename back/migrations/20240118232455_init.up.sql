CREATE TYPE user_role AS ENUM ('admin', 'moderator', 'user');
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE "users" (
    id UUID NOT NULL PRIMARY KEY DEFAULT (uuid_generate_v4()),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    password VARCHAR(100) NOT NULL,
    role user_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE "projects" (
    id UUID NOT NULL PRIMARY KEY DEFAULT (uuid_generate_v4()),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    cover TEXT NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(255) NOT NULL,
    tags TEXT[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE "articles" (
    id UUID NOT NULL PRIMARY KEY DEFAULT (uuid_generate_v4()),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    cover TEXT NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    author_id UUID NOT NULL,
    tags TEXT[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (author_id) REFERENCES users(id)
);

CREATE INDEX projects_slug_idx ON projects (slug);
CREATE INDEX articles_slug_idx ON articles (slug);
CREATE INDEX articles_author_idx ON articles (author_id);
CREATE INDEX users_email_idx ON users (email);
CREATE INDEX users_name_idx ON users (name);

CREATE INDEX projects_tags_idx ON projects USING gin (tags);
CREATE INDEX articles_tags_idx ON articles USING gin (tags);

CREATE OR REPLACE FUNCTION get_projects_by_tags(tags_to_filter TEXT[])
RETURNS SETOF projects AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM projects
    WHERE tags && tags_to_filter;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_articles_by_tags(tags_to_filter TEXT[])
RETURNS SETOF articles AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM articles
    WHERE tags && tags_to_filter;
END;
$$ LANGUAGE plpgsql;
