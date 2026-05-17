variable "project_name" {
  description = "Prefix used for Docker resources created by Terraform."
  type        = string
  default     = "habit-tracker"
}

variable "api_port" {
  description = "Host port for the FastAPI backend."
  type        = number
  default     = 8000
}

variable "frontend_port" {
  description = "Host port for the React/nginx frontend."
  type        = number
  default     = 3000
}

variable "postgres_port" {
  description = "Host port for PostgreSQL when expose_postgres is true."
  type        = number
  default     = 5432
}

variable "redis_port" {
  description = "Host port for Redis when expose_redis is true."
  type        = number
  default     = 6379
}

variable "expose_postgres" {
  description = "Expose PostgreSQL on the host machine. Backend does not need this because it uses the Docker network."
  type        = bool
  default     = false
}

variable "expose_redis" {
  description = "Expose Redis on the host machine. Backend does not need this because it uses the Docker network."
  type        = bool
  default     = false
}

variable "postgres_user" {
  description = "PostgreSQL user."
  type        = string
  default     = "user"
}

variable "postgres_password" {
  description = "PostgreSQL password."
  type        = string
  sensitive   = true
  default     = "password"
}

variable "postgres_db" {
  description = "PostgreSQL database name."
  type        = string
  default     = "habitdb"
}

variable "secret_key" {
  description = "JWT secret key used by the backend."
  type        = string
  sensitive   = true
  default     = "change-this-secret-key-in-production"
}

variable "access_token_expire_minutes" {
  description = "JWT access token lifetime in minutes."
  type        = number
  default     = 30
}

variable "cors_origins" {
  description = "Comma-separated origins allowed by backend CORS."
  type        = string
  default     = "http://localhost:3000,http://localhost:5173"
}

variable "frontend_api_url" {
  description = "API URL embedded into the frontend build."
  type        = string
  default     = "http://localhost:8000"
}

variable "prometheus_port" {
  description = "Host port for Prometheus."
  type        = number
  default     = 9090
}

variable "grafana_port" {
  description = "Host port for Grafana."
  type        = number
  default     = 3001
}

variable "alertmanager_port" {
  description = "Host port for Alertmanager."
  type        = number
  default     = 9093
}

variable "grafana_admin_user" {
  description = "Grafana admin username."
  type        = string
  default     = "admin"
}

variable "grafana_admin_password" {
  description = "Grafana admin password."
  type        = string
  sensitive   = true
  default     = "admin"
}