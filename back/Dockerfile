# Builder Stage
FROM rust:1.75-bullseye as builder
ENV SQLX_OFFLINE=true

WORKDIR /back

# Copy and build dependencies
COPY . .
RUN cargo build --release --locked
RUN rm src/*.rs
RUN rm target/release/deps/*


# Production Stage
FROM debian:bullseye-slim
ARG APP=/usr/src/app

RUN apt-get update \
    && apt-get install -y ca-certificates tzdata \
    && rm -rf /var/lib/apt/lists/*

ENV TZ=Etc/UTC \
    APP_USER=appuser

RUN groupadd $APP_USER \
    && useradd -g $APP_USER $APP_USER \
    && mkdir -p ${APP}

COPY --from=builder /back/target/release/back ${APP}/back

RUN chown -R $APP_USER:$APP_USER ${APP}

USER $APP_USER
WORKDIR ${APP}

ENTRYPOINT ["./back"]
EXPOSE 8000
# FROM rust:1.75-bullseye AS planner
# WORKDIR /back
# # We only pay the installation cost once,
# # it will be cached from the second build onwards
# # To ensure a reproducible build consider pinning
# # the cargo-chef version with `--version X.X.X`
# RUN cargo install cargo-chef
# COPY . .
# # Compute a lock-like file for our project
# RUN cargo chef prepare  --recipe-path recipe.json
#
# FROM rust:1.75-bullseye AS cacher
# WORKDIR /back
# RUN cargo install cargo-chef
# COPY --from=planner /back/recipe.json recipe.json
# # Build our project dependencies, not our application!
# RUN cargo chef cook --release --recipe-path recipe.json
#
# FROM rust:1.75-bullseye AS builder
# WORKDIR /back
# # Copy over the cached dependencies
# COPY --from=cacher /back/target target
# COPY --from=cacher /usr/local/cargo /usr/local/cargo
# COPY . .
# # Build our application, leveraging the cached deps!
# ENV SQLX_OFFLINE true
# RUN cargo build --release
#
# FROM debian:bullseye-slim AS runtime
# WORKDIR /back
# RUN apt-get update -y \
#     && apt-get install -y --no-install-recommends openssl \
#     # Clean up
#     && apt-get autoremove -y && apt-get clean -y && rm -rf /var/lib/apt/lists/*
# COPY --from=builder /back/target/release/back back
# ENTRYPOINT ["./back"]
