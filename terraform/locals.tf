locals {
  network_name            = "${var.project_name}-network"
  postgres_volume_name    = "${var.project_name}-postgres-data"
  redis_volume_name       = "${var.project_name}-redis-data"
  postgres_container_name = "${var.project_name}-postgres"
  redis_container_name    = "${var.project_name}-redis"
  api_container_name      = "${var.project_name}-api"
  frontend_container_name = "${var.project_name}-frontend"
  api_image_name          = "${var.project_name}-api:terraform"
  frontend_image_name     = "${var.project_name}-frontend:terraform"
  database_url            = "postgresql+asyncpg://${var.postgres_user}:${var.postgres_password}@${local.postgres_container_name}:5432/${var.postgres_db}"
  redis_url               = "redis://${local.redis_container_name}:6379"
}
