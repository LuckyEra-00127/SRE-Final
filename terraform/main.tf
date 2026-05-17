resource "docker_network" "app" {
  name = local.network_name
}

resource "docker_volume" "postgres_data" {
  name = local.postgres_volume_name
}

resource "docker_volume" "redis_data" {
  name = local.redis_volume_name
}

resource "docker_image" "postgres" {
  name         = "postgres:15-alpine"
  keep_locally = true
}

resource "docker_image" "redis" {
  name         = "redis:7-alpine"
  keep_locally = true
}

resource "docker_image" "api" {
  name         = local.api_image_name
  keep_locally = true

  build {
    context = abspath("${path.module}/../habit-tracker")
  }
}

resource "docker_image" "frontend" {
  name         = local.frontend_image_name
  keep_locally = true

  build {
    context = abspath("${path.module}/../habit-tracker-frontend")
    build_args = {
      VITE_API_URL = var.frontend_api_url
    }
  }
}

resource "docker_container" "postgres" {
  name    = local.postgres_container_name
  image   = docker_image.postgres.image_id
  restart = "unless-stopped"

  env = [
    "POSTGRES_USER=${var.postgres_user}",
    "POSTGRES_PASSWORD=${var.postgres_password}",
    "POSTGRES_DB=${var.postgres_db}"
  ]

  dynamic "ports" {
    for_each = var.expose_postgres ? [1] : []

    content {
      internal = 5432
      external = var.postgres_port
    }
  }

  volumes {
    volume_name    = docker_volume.postgres_data.name
    container_path = "/var/lib/postgresql/data"
  }

  networks_advanced {
    name = docker_network.app.name
  }

  healthcheck {
    test     = ["CMD-SHELL", "pg_isready -U ${var.postgres_user} -d ${var.postgres_db}"]
    interval = "5s"
    timeout  = "5s"
    retries  = 10
  }
}

resource "docker_container" "redis" {
  name    = local.redis_container_name
  image   = docker_image.redis.image_id
  restart = "unless-stopped"

  dynamic "ports" {
    for_each = var.expose_redis ? [1] : []

    content {
      internal = 6379
      external = var.redis_port
    }
  }

  volumes {
    volume_name    = docker_volume.redis_data.name
    container_path = "/data"
  }

  networks_advanced {
    name = docker_network.app.name
  }

  healthcheck {
    test     = ["CMD", "redis-cli", "ping"]
    interval = "5s"
    timeout  = "3s"
    retries  = 10
  }
}

resource "docker_container" "api" {
  name    = local.api_container_name
  image   = docker_image.api.image_id
  restart = "unless-stopped"

  env = [
    "DATABASE_URL=${local.database_url}",
    "REDIS_URL=${local.redis_url}",
    "SECRET_KEY=${var.secret_key}",
    "ALGORITHM=HS256",
    "ACCESS_TOKEN_EXPIRE_MINUTES=${var.access_token_expire_minutes}",
    "AUTO_CREATE_TABLES=true",
    "CORS_ORIGINS=${var.cors_origins}"
  ]

  ports {
    internal = 8000
    external = var.api_port
  }

  networks_advanced {
    name = docker_network.app.name
  }

  depends_on = [
    docker_container.postgres,
    docker_container.redis
  ]
}

resource "docker_container" "frontend" {
  name    = local.frontend_container_name
  image   = docker_image.frontend.image_id
  restart = "unless-stopped"

  ports {
    internal = 80
    external = var.frontend_port
  }

  networks_advanced {
    name = docker_network.app.name
  }

  depends_on = [
    docker_container.api
  ]
}
