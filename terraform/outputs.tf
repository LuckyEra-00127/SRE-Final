output "frontend_url" {
  description = "Frontend URL."
  value       = "http://localhost:${var.frontend_port}"
}

output "api_url" {
  description = "Backend API URL."
  value       = "http://localhost:${var.api_port}"
}

output "api_health_url" {
  description = "Backend health endpoint."
  value       = "http://localhost:${var.api_port}/health"
}

output "api_metrics_url" {
  description = "Backend metrics endpoint."
  value       = "http://localhost:${var.api_port}/metrics"
}

output "docker_network" {
  description = "Docker network created by Terraform."
  value       = docker_network.app.name
}

output "containers" {
  description = "Docker containers managed by Terraform."
  value = {
    postgres = docker_container.postgres.name
    redis    = docker_container.redis.name
    api      = docker_container.api.name
    frontend = docker_container.frontend.name
  }
}

output "prometheus_url" {
  description = "Prometheus URL."
  value       = "http://localhost:${var.prometheus_port}"
}

output "grafana_url" {
  description = "Grafana URL."
  value       = "http://localhost:${var.grafana_port}"
}

output "alertmanager_url" {
  description = "Alertmanager URL."
  value       = "http://localhost:${var.alertmanager_port}"
}