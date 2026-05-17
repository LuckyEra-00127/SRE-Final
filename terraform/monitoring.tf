resource "docker_volume" "prometheus_data" {
  name = "${var.project_name}-prometheus-data"
}

resource "docker_volume" "grafana_data" {
  name = "${var.project_name}-grafana-data"
}

resource "docker_volume" "alertmanager_data" {
  name = "${var.project_name}-alertmanager-data"
}

resource "docker_image" "prometheus" {
  name         = "prom/prometheus:latest"
  keep_locally = true
}

resource "docker_image" "grafana" {
  name         = "grafana/grafana:latest"
  keep_locally = true
}

resource "docker_image" "alertmanager" {
  name         = "prom/alertmanager:latest"
  keep_locally = true
}

resource "docker_container" "alertmanager" {
  name    = "${var.project_name}-alertmanager"
  image   = docker_image.alertmanager.image_id
  restart = "unless-stopped"

  command = [
    "--config.file=/etc/alertmanager/alertmanager.yml",
    "--storage.path=/alertmanager"
  ]

  ports {
    internal = 9093
    external = var.alertmanager_port
  }

  volumes {
    host_path      = abspath("${path.module}/../monitoring/alertmanager")
    container_path = "/etc/alertmanager"
    read_only      = true
  }

  volumes {
    volume_name    = docker_volume.alertmanager_data.name
    container_path = "/alertmanager"
  }

  networks_advanced {
    name = docker_network.app.name
  }
}

resource "docker_container" "prometheus" {
  name    = "${var.project_name}-prometheus"
  image   = docker_image.prometheus.image_id
  restart = "unless-stopped"

  command = [
    "--config.file=/etc/prometheus/prometheus.yml",
    "--storage.tsdb.path=/prometheus",
    "--web.enable-lifecycle"
  ]

  ports {
    internal = 9090
    external = var.prometheus_port
  }

  volumes {
    host_path      = abspath("${path.module}/../monitoring/prometheus")
    container_path = "/etc/prometheus"
    read_only      = true
  }

  volumes {
    volume_name    = docker_volume.prometheus_data.name
    container_path = "/prometheus"
  }

  networks_advanced {
    name = docker_network.app.name
  }

  depends_on = [
    docker_container.api,
    docker_container.alertmanager
  ]
}

resource "docker_container" "grafana" {
  name    = "${var.project_name}-grafana"
  image   = docker_image.grafana.image_id
  restart = "unless-stopped"

  env = [
    "GF_SECURITY_ADMIN_USER=${var.grafana_admin_user}",
    "GF_SECURITY_ADMIN_PASSWORD=${var.grafana_admin_password}",
    "GF_USERS_ALLOW_SIGN_UP=false"
  ]

  ports {
    internal = 3000
    external = var.grafana_port
  }

  volumes {
    host_path      = abspath("${path.module}/../monitoring/grafana/provisioning")
    container_path = "/etc/grafana/provisioning"
    read_only      = true
  }

  volumes {
    host_path      = abspath("${path.module}/../monitoring/grafana/dashboards")
    container_path = "/var/lib/grafana/dashboards"
    read_only      = true
  }

  volumes {
    volume_name    = docker_volume.grafana_data.name
    container_path = "/var/lib/grafana"
  }

  networks_advanced {
    name = docker_network.app.name
  }

  depends_on = [
    docker_container.prometheus
  ]
}