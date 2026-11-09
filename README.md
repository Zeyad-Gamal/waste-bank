# Waste Bank Platform

A backend and DevOps implementation for an agricultural waste trading and management platform. The system connects farmers and factories through workflows for offers, purchases, inventory, factory requests, sales, shipments, and notifications.

This repository contains the **Node.js backend** and the **production deployment setup** used to run it on AWS.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Core Workflows](#core-workflows)
- [Technology Stack](#technology-stack)
- [Backend Capabilities](#backend-capabilities)
- [DevOps and Infrastructure](#devops-and-infrastructure)
- [Architecture](#architecture)
- [CI/CD Pipeline](#cicd-pipeline)
- [Repository Structure](#repository-structure)
- [Local Development](#local-development)
- [Production Deployment](#production-deployment)
- [Environment Configuration](#environment-configuration)
- [Database Migrations](#database-migrations)
- [Health Check](#health-check)
- [Security Notes](#security-notes)
- [Operational Notes](#operational-notes)

---

## Project Overview

Waste Bank is a platform for managing the trading lifecycle of agricultural waste and residues. It provides a centralized backend for managing platform users, farmers, factories, agricultural-waste offers, purchasing, inventory, factory requests, sales, shipments, and related notifications.

The backend exposes RESTful APIs for client applications and uses Socket.IO for real-time communication. Its API-first design supports the current web administration interface and mobile application integration.

The project also includes a containerized production environment and an automated CI/CD workflow that builds, scans, publishes, and deploys application images to an AWS EC2 server.

## Core Workflows

The platform supports workflows including:

- **Farmers and offers:** managing farmer accounts and agricultural-waste offers, including offer images.
- **Purchases:** recording purchases associated with offers.
- **Inventory:** tracking available waste inventory.
- **Factories and requests:** managing factories and their waste requirements.
- **Sales and shipments:** managing sales, sale items, and shipment operations.
- **Notifications:** delivering system notifications and real-time updates to connected clients.

The exact business rules and permissions are implemented in the backend application.

## Technology Stack

### Backend

| Technology | Purpose |
|---|---|
| Node.js 20 | JavaScript runtime |
| Express 5 | HTTP API framework |
| MySQL 8 | Relational database |
| Sequelize 6 | ORM, models, relationships, and migrations |
| JWT | Authentication tokens |
| bcrypt | Password hashing |
| Joi | Request validation |
| Socket.IO | Real-time communication |
| Nodemailer / email service | Email verification and system email delivery |

### DevOps and Infrastructure

| Technology | Purpose |
|---|---|
| AWS EC2 | Production compute environment |
| Ubuntu Server | EC2 operating system |
| Docker | Application and service containerization |
| Docker Compose | Production multi-container orchestration |
| Nginx | Reverse proxy and public HTTP entry point |
| GitHub Actions | CI/CD automation |
| Docker Hub | Container image registry |
| Trivy | Container image vulnerability scanning |
| Git and GitHub | Source control and workflow triggers |

---

## Backend Capabilities

- RESTful API architecture built with Node.js and Express.
- JWT-based authentication and protected API access.
- Role-based authorization for platform user roles.
- Password hashing with bcrypt.
- Request validation using Joi.
- Relational data modeling and associations using Sequelize.
- Database schema management through Sequelize migrations.
- Agricultural-waste offer and image management.
- Purchase, inventory, factory-request, sales, and shipment workflows.
- Real-time notifications and events using Socket.IO.
- Email verification and system email communication.
- Centralized backend integration for web and mobile clients.

> For the authoritative list of routes, request payloads, and response schemas, refer to the API implementation or the project's API documentation if maintained separately.

## DevOps and Infrastructure

The production environment runs on a single AWS EC2 instance. Docker Compose manages the application services.

### Production services

| Service | Responsibility |
|---|---|
| Nginx | Receives public HTTP traffic and proxies requests to the backend |
| Node.js API | Runs the Express application and Socket.IO server |
| MySQL 8 | Stores application data |
| Docker volumes | Persist database data and uploaded files |

### Network design

- Nginx is the public application entry point on port `80`.
- The backend listens on port `3000` inside the Docker network.
- MySQL listens on port `3306` inside the Docker network and is not published as a public host port.
- Nginx proxies REST API requests to the backend.
- Nginx is configured to support Socket.IO upgrade requests.
- Uploaded files and MySQL data use persistent storage so container recreation does not itself remove their stored contents.

### Deployment model

The deployment uses versioned Docker images. GitHub Actions builds an image and publishes both a `latest` tag and a commit-SHA tag to Docker Hub. The EC2 deployment pulls the image identified by the commit SHA and recreates the relevant Compose services.

---

## Architecture

### CI/CD and deployment flow

```text
Developer
   |
   v
GitHub Repository
   |
   v
GitHub Actions
   |
   +--> Checkout source
   |
   +--> Set up Node.js
   |
   +--> Install dependencies
   |
   +--> Run automated tests
   |
   +--> Build Docker image
   |
   +--> Push image to Docker Hub
   |
   +--> Trivy image vulnerability scan
   |
   v
SSH deployment to AWS EC2
   |
   +--> Pull commit-tagged image
   |
   +--> Start/update Docker Compose services
   |
   +--> Run deployment health check
   |
   v
Production environment
   |
   +--> Nginx container :80
   |
   +--> Node.js / Express container :3000
   |
   +--> MySQL 8 container :3306 (internal only)
   |
   +--> Persistent database and uploads volumes
```

### Runtime request flow

```text
Web Admin / Mobile Client
          |
          v
     Nginx :80
          |
          v
 Node.js / Express :3000
          |
          v
 MySQL :3306
 (Docker network only)
```

Socket.IO traffic is also routed through Nginx to the Node.js application.

---

## CI/CD Pipeline

The GitHub Actions workflow is defined in:

```text
.github/workflows/ci.yml
```

### Pull requests

For pull requests targeting `main` or `master`, the workflow:

1. Checks out the repository.
2. Sets up Node.js 20.
3. Installs dependencies using `npm ci`.
4. Runs the automated test command (`npm test`).

### Pushes to `main` or `master`

For pushes to the deployment branches, the workflow:

1. Runs the test job.
2. Authenticates to Docker Hub using GitHub Actions secrets.
3. Builds the production Docker image.
4. Publishes the image using:
   - `latest`
   - The Git commit SHA
5. Runs Trivy vulnerability scanning against the published image.
6. Connects to the EC2 instance over SSH.
7. Fetches the latest deployment configuration from the Git repository.
8. Pulls the image tagged with the current commit SHA.
9. Updates the application services using Docker Compose.
10. Retries the HTTP health check before declaring deployment success.

### Image tagging

Commit-SHA tags make each published image traceable to the source revision that produced it. The `latest` tag is also published as a convenient moving tag; the production deployment uses the commit-SHA tag.

### GitHub Actions secrets

Configure the following repository secrets before enabling deployment:

| Secret | Purpose |
|---|---|
| `DOCKERHUB_USERNAME` | Docker Hub account name |
| `DOCKERHUB_TOKEN` | Docker Hub access token |
| `EC2_HOST` | Public IP address or hostname of the EC2 instance |
| `EC2_SSH_KEY` | Private SSH key used by the deployment workflow |

Never commit secret values, private keys, or production `.env` files to the repository.

> **Scanning behavior:** the workflow runs Trivy against the built image and reports HIGH and CRITICAL vulnerabilities. Review the workflow's `exit-code` setting to determine whether findings should fail the pipeline; a value of `0` makes the scan informational rather than a deployment-blocking security gate.

---

## Repository Structure

The exact repository may contain additional files. The main deployment-related paths include:

```text
.
├── .github/
│   └── workflows/
│       └── ci.yml
├── nginx/
│   └── nginx.conf
├── src/
│   ├── migrations/
│   ├── models/
│   └── services/
├── Dockerfile
├── docker-compose.prod.yml
├── server.js
├── package.json
└── package-lock.json
```

- `Dockerfile`: builds the production backend image using a multi-stage build.
- `docker-compose.prod.yml`: defines the production application, database, and Nginx services.
- `nginx/nginx.conf`: configures reverse proxying and Socket.IO routing.
- `.github/workflows/ci.yml`: defines the CI/CD workflow.
- `src/migrations/`: contains Sequelize database migrations.
- `src/models/`: contains Sequelize models.
- `src/services/`: contains backend service logic.

---

## Local Development

### Prerequisites

- Node.js 20
- npm
- MySQL 8
- Git

### Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd <YOUR_REPOSITORY_DIRECTORY>
```

### Install dependencies

```bash
npm ci
```

### Configure environment variables

Create a local `.env` file using the variable names required by the application. Do not copy production credentials into a public or shared environment.

At minimum, configure the database connection and the application secrets/URLs expected by the backend. Check the application's configuration files and Sequelize configuration for the exact required variable names.

### Run the application

Use the development or start script defined in `package.json`. To inspect available scripts:

```bash
npm run
```

### Run tests

```bash
npm test
```

---

## Production Deployment

The production deployment is managed by GitHub Actions. A push to the configured deployment branch triggers the workflow.

The EC2 instance must have:

- Ubuntu Server.
- Docker Engine and the Docker Compose plugin.
- Git and access to the repository.
- The production Compose file and Nginx configuration.
- A production `.env` file stored securely on the server.
- Network access to pull images from Docker Hub.

### Manual operational commands

Run these commands on the EC2 instance from the project directory when performing authorized maintenance.

Check service status:

```bash
docker compose -f docker-compose.prod.yml ps
```

View application logs:

```bash
docker logs waste-bank-api-prod --tail 100
```

View Nginx logs:

```bash
docker logs waste-bank-nginx --tail 100
```

View MySQL logs:

```bash
docker logs waste-bank-db-prod --tail 100
```

Check the HTTP health endpoint locally on the EC2 host:

```bash
curl -f http://localhost/health
```

Pull and update services manually only when needed:

```bash
docker compose -f docker-compose.prod.yml pull app
docker compose -f docker-compose.prod.yml up -d app mysql nginx
```

> The production Compose configuration expects the image tag to be supplied through `IMAGE_TAG`. Follow the deployment workflow or export the intended tag before running Compose manually.

---

## Environment Configuration

The application and production Compose setup use environment variables for configuration.

Examples of configuration values used by the deployment include:

- `BASE_URL`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `MYSQL_ROOT_PASSWORD`
- Authentication and email-service credentials required by the application.

The complete list depends on the backend configuration. Confirm the exact variable names against the current application code and deployment files before creating a new environment.

### Important

- Keep `.env` out of Git.
- Use GitHub Actions secrets for CI/CD credentials.
- Keep production credentials on the server or in an appropriate secrets manager.
- Do not expose database credentials in logs, screenshots, issue trackers, or documentation.
- Set `BASE_URL` to the externally reachable base URL used to generate absolute file URLs. Update it when the production domain or public endpoint changes.

---

## Database Migrations

The backend uses Sequelize migrations to manage schema changes.

Migrations should be applied deliberately as part of a deployment or controlled maintenance operation. Before running migrations against production:

1. Confirm the target database and environment.
2. Ensure a recent database backup exists.
3. Review the migration for destructive operations.
4. Apply the migration.
5. Verify the application and affected workflows afterward.

Do not use `db:migrate:undo:all` on a production database unless a full rollback/data-loss operation is explicitly intended and approved.

The production image is intentionally kept lean and does not include npm/npx in its runtime layer. If Sequelize CLI is not available inside the application container, use a controlled migration environment with the required dependencies and production configuration rather than assuming `npx` is installed in the runtime container.

---

## Health Check

The backend exposes a health endpoint at:

```text
GET /health
```

The deployment workflow checks the endpoint through Nginx after updating the services. It retries the request to allow the application time to become ready.

A successful response indicates that the endpoint is reachable. It should not be treated as a complete verification of every business workflow or external integration.

---

## Security Notes

- MySQL is kept on the internal Docker network and is not exposed through a public host port.
- Nginx is the public HTTP entry point for application traffic.
- Production environment variables and credentials must not be committed to Git.
- Docker images are scanned with Trivy for OS and library vulnerabilities.
- The backend runtime image uses a non-root `node` user.
- The production Docker image uses a multi-stage build and excludes npm/npx from the final runtime image.
- Restrict SSH access to trusted source IPs where possible. If the deployment runner requires a different access strategy, consider a more controlled deployment mechanism rather than leaving SSH open to the entire internet.
- The current Nginx configuration described here serves HTTP on port `80`. Configure HTTPS and a production domain before handling sensitive production traffic over the public internet.

---

## Operational Notes

- The current infrastructure is a single EC2 host using Docker Compose. It is a straightforward deployment model, but the EC2 instance is also a single point of failure.
- MySQL data and uploaded files rely on persistent Docker volumes. Persistent volumes are not a substitute for off-instance backups.
- Establish and periodically test a backup and restore procedure before relying on production data.
- Monitor disk usage, memory, container health, and application logs on the EC2 host.
- Keep the production environment variables synchronized with the application configuration, especially values such as `BASE_URL`.
- The project currently uses EC2, Docker Compose, and a self-managed MySQL container. Kubernetes, Terraform, Ansible, ECS, EKS, and RDS are not part of the described deployment.

---

## Project Status

The backend and the initial production DevOps deployment have been implemented. The platform can be extended as client integration and operational requirements evolve.

Further production-hardening work may include:

- Domain name and HTTPS configuration.
- More restrictive deployment access (SSH hardening or an alternative deployment mechanism).
- Automated off-instance database and uploads backups, with restore testing.
- Monitoring and alerting.
- CI/CD improvements and stricter vulnerability-scan enforcement.
- Maintained API documentation.
- A final production security and configuration review.

---

## Maintainer

**Zeyad Gamal**

Backend Development | DevOps | Cloud Infrastructure
