# Terraform Infrastructure

This directory provisions the local Habit Tracker infrastructure from scratch using Terraform and the Docker provider.

## What Terraform Creates

- Docker network
- PostgreSQL volume and container
- Redis volume and container
- Backend Docker image and container
- Frontend Docker image and nginx container
- Published ports for frontend, API, PostgreSQL, and Redis

## Prerequisites

- Docker Desktop running
- Terraform 1.6 or newer
- Free local ports: `3000`, `8000`
- PostgreSQL and Redis run inside the Docker network by default and do not need host ports.

If you already started the project with Docker Compose, stop it first:

```powershell
cd "D:\AITU Projects\SRE_Final\habit-tracker"
docker compose down

cd "D:\AITU Projects\SRE_Final\habit-tracker-frontend"
docker compose down
```

## Configure Variables

From the repository root:

```powershell
cd "D:\AITU Projects\SRE_Final\terraform"
Copy-Item terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars` if you need different ports or secrets.

By default:

```hcl
expose_postgres = false
expose_redis    = false
```

Keep these values as `false` unless you specifically need to connect to PostgreSQL or Redis from your host machine. This avoids common port conflicts on `5432` and `6379`.

## Provision Infrastructure

```powershell
terraform init
terraform fmt
terraform validate
terraform plan
terraform apply
```

Type `yes` when Terraform asks for confirmation.

## Verify It Works

Check Terraform outputs:

```powershell
terraform output
```

Check containers:

```powershell
docker ps
```

Expected containers:

- `habit-tracker-postgres`
- `habit-tracker-redis`
- `habit-tracker-api`
- `habit-tracker-frontend`

Check backend health:

```powershell
Invoke-RestMethod http://localhost:8000/health
```

Expected response:

```json
{
  "status": "ok",
  "db": "ok",
  "redis": "ok"
}
```

Check metrics:

```powershell
Invoke-WebRequest http://localhost:8000/metrics | Select-Object -ExpandProperty Content
```

Open the frontend:

```text
http://localhost:3000
```

Register a user, create a habit, check it in, and verify the dashboard updates.

## Destroy Infrastructure

```powershell
terraform destroy
```

Type `yes` when prompted.

This removes the containers, images managed by Terraform, network, and Docker volumes created by this Terraform configuration.
