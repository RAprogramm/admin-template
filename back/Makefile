start:
	cargo run

dev:
	cargo watch --env-file .dev.env -x  run

install_sqlx:
	cargo install sqlx-cli --no-default-features --features postgres

db_migrate:
	sqlx migrate run -D "postgresql://postgres:password123@127.0.0.1:5432/rust_admin?schema=public"

db_revert:
	sqlx migrate revert -D "postgresql://postgres:password123@127.0.0.1:5432/rust_admin?schema=public"

run_prepared_sqlx:
	cargo sqlx prepare -D "postgresql://postgres:password123@127.0.0.1:5432/rust_admin?schema=public"
