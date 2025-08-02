.PHONY: help install dev build test test-watch test-e2e lint format clean docker-build docker-run docker-stop seed migrate migrate-revert

# Default target
help:
	@echo "Available commands:"
	@echo "  install      - Install dependencies"
	@echo "  dev          - Start development server"
	@echo "  build        - Build for production"
	@echo "  test         - Run tests"
	@echo "  test-watch   - Run tests in watch mode"
	@echo "  test-e2e     - Run end-to-end tests"
	@echo "  lint         - Run linter"
	@echo "  format       - Format code"
	@echo "  clean        - Clean build artifacts"
	@echo "  docker-build - Build Docker image"
	@echo "  docker-run   - Run with Docker Compose"
	@echo "  docker-stop  - Stop Docker containers"
	@echo "  seed         - Seed database with sample data"
	@echo "  migrate      - Run database migrations"
	@echo "  migrate-revert - Revert last migration"
	@echo "  setup        - Setup development environment"
	@echo "  deploy-prod  - Deploy to production"
	@echo "  deploy-nginx - Deploy with Nginx"
	@echo "  logs         - Show logs"
	@echo "  backup       - Backup database"
	@echo "  restore      - Restore database"
	@echo "  health       - Health check"
	@echo "  docs         - Open API documentation"
	@echo "  pgadmin      - Open pgAdmin"

# Install dependencies
install:
	npm install

# Start development server
dev:
	npm run start:dev

# Build for production
build:
	npm run build

# Run tests
test:
	npm run test

# Run tests in watch mode
test-watch:
	npm run test:watch

# Run end-to-end tests
test-e2e:
	npm run test:e2e

# Run linter
lint:
	npm run lint

# Format code
format:
	npm run format

# Clean build artifacts
clean:
	rm -rf dist
	rm -rf node_modules
	rm -rf coverage

# Build Docker image
docker-build:
	docker build -t farm-producers-api .

# Run with Docker Compose (development)
docker-run:
	docker-compose up -d

# Stop Docker containers
docker-stop:
	docker-compose down

# Seed database
seed:
	npm run seed

# Run migrations
migrate:
	npm run migration:run

# Revert last migration
migrate-revert:
	npm run migration:revert

# Setup development environment
setup: install
	cp env.example .env
	docker-compose up -d postgres
	@echo "Waiting for database to be ready..."
	@sleep 10
	npm run migration:run
	npm run seed
	@echo "Development environment setup complete!"

# Production deployment
deploy-prod:
	docker-compose -f docker-compose.prod.yml up -d

# Production deployment with nginx
deploy-nginx:
	docker-compose -f docker-compose.nginx.yml up -d

# Show logs
logs:
	docker-compose logs -f

# Show logs for specific service
logs-app:
	docker-compose logs -f app

logs-db:
	docker-compose logs -f postgres

# Database backup
backup:
	docker-compose exec postgres pg_dump -U postgres farm_producers > backup_$(shell date +%Y%m%d_%H%M%S).sql

# Database restore
restore:
	@read -p "Enter backup file name: " backup_file; \
	docker-compose exec -T postgres psql -U postgres farm_producers < $$backup_file

# Health check
health:
	curl -f http://localhost:3000/api-docs || echo "Service is not healthy"

# Open API documentation
docs:
	open http://localhost:3000/api-docs

# Open pgAdmin
pgadmin:
	open http://localhost:5050

# Production logs
logs-prod:
	docker-compose -f docker-compose.prod.yml logs -f

# Production logs with nginx
logs-nginx:
	docker-compose -f docker-compose.nginx.yml logs -f

# Stop production
stop-prod:
	docker-compose -f docker-compose.prod.yml down

# Stop production with nginx
stop-nginx:
	docker-compose -f docker-compose.nginx.yml down

# Rebuild and restart production
rebuild-prod:
	docker-compose -f docker-compose.prod.yml up -d --build

# Rebuild and restart production with nginx
rebuild-nginx:
	docker-compose -f docker-compose.nginx.yml up -d --build 