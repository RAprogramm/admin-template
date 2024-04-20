#!/bin/bash

cd /rust_admin

# Остановить и удалить существующие контейнеры
docker-compose down

# Подтянуть последние образы из Docker Hub
docker-compose pull

# Пересоздать и запустить контейнеры
docker-compose up -d
