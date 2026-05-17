# Habit Tracker

Habit Tracker is a full-stack web application for tracking daily and weekly habits.

The project includes:

- FastAPI backend
- React + TypeScript frontend
- PostgreSQL database
- Redis cache
- Docker containers
- Terraform infrastructure for local deployment

## Project Structure

```text
SRE_Final/
├── habit-tracker/            # FastAPI backend
├── habit-tracker-frontend/   # React frontend
└── terraform/                # Infrastructure as Code
```

## Main URLs

When the project is started with Terraform:

```text
Frontend: http://localhost:3000
Backend:  http://localhost:8000
Health:   http://localhost:8000/health
Metrics:  http://localhost:8000/metrics
```

## Requirements

Install and run:

- Docker Desktop
- Terraform

Docker Desktop must be running before using Terraform.

## Start the Project

Use Terraform as the main way to run the project.

First, stop old Docker Compose containers if they are running:

```powershell
cd "D:\AITU Projects\SRE_Final\habit-tracker"
docker compose down

cd "D:\AITU Projects\SRE_Final\habit-tracker-frontend"
docker compose down
```

Then start the infrastructure:

```powershell
cd "D:\AITU Projects\SRE_Final\terraform"
terraform init
terraform apply
```

When Terraform asks:

```text
Do you want to perform these actions?
```

Type:

```text
yes
```

After successful startup, open:

```text
http://localhost:3000
```

## Check That Everything Works

Check running containers:

```powershell
docker ps
```

Expected containers:

```text
habit-tracker-frontend
habit-tracker-api
habit-tracker-postgres
habit-tracker-redis
```

Check backend health:

```powershell
Invoke-RestMethod http://localhost:8000/health
```

Expected response:

```json
{"status":"ok","db":"ok","redis":"ok"}
```

Check Terraform outputs:

```powershell
cd "D:\AITU Projects\SRE_Final\terraform"
terraform output
```

## Stop the Project

To fully remove the Terraform-created infrastructure:

```powershell
cd "D:\AITU Projects\SRE_Final\terraform"
terraform destroy
```

When Terraform asks for confirmation, type:

```text
yes
```

Important: `terraform destroy` removes the Docker volumes too, so database data can be deleted.

## Data Persistence

User data, habits, and check-ins are stored in PostgreSQL.

PostgreSQL data is stored in this Docker volume:

```text
habit-tracker-postgres-data
```

Check volumes:

```powershell
docker volume ls
```

Inspect the PostgreSQL volume:

```powershell
docker volume inspect habit-tracker-postgres-data
```

## View User Data

You can inspect data directly from PostgreSQL using `docker exec`.

List database tables:

```powershell
docker exec habit-tracker-postgres psql -U user -d habitdb -c "\dt"
```

View users:

```powershell
docker exec habit-tracker-postgres psql -U user -d habitdb -c "SELECT id, email, created_at FROM users;"
```

View habits:

```powershell
docker exec habit-tracker-postgres psql -U user -d habitdb -c "SELECT id, user_id, name, description, frequency, created_at FROM habits;"
```

View check-ins:

```powershell
docker exec habit-tracker-postgres psql -U user -d habitdb -c "SELECT id, habit_id, date, created_at FROM checkins;"
```

View users with their habits and check-in dates:

```powershell
docker exec habit-tracker-postgres psql -U user -d habitdb -c "SELECT u.email, h.name AS habit, h.frequency, c.date AS checked_in_date FROM users u JOIN habits h ON h.user_id = u.id LEFT JOIN checkins c ON c.habit_id = h.id ORDER BY u.email, h.name, c.date;"
```

Password hashes are stored in the database, but they should not be displayed in normal checks.

