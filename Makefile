# Farm Management System - Docker Compose Commands

.PHONY: help build up down dev prod logs clean

# Default target
help:
	@echo "Farm Management System - Docker Compose Commands"
	@echo ""
	@echo "Available commands:"
	@echo "  make build     - Build all Docker images"
	@echo "  make up        - Start production environment with database"
	@echo "  make up-no-db  - Start production environment without database"
	@echo "  make dev       - Start development environment with database"
	@echo "  make dev-no-db - Start development environment without database"
	@echo "  make down      - Stop all containers"
	@echo "  make logs      - Show logs from all containers"
	@echo "  make clean     - Remove all containers, volumes, and images"
	@echo ""
	@echo "Database commands:"
	@echo "  make db-migrate    - Run database migrations"
	@echo "  make db-seed       - Seed database with test data"
	@echo "  make db-generate   - Generate new migration"
	@echo "  make db-revert     - Revert last migration"
	@echo ""
	@echo "Test commands:"
	@echo "  make test          - Run unit tests"
	@echo "  make test-e2e      - Run end-to-end tests"
	@echo "  make test-watch    - Run tests in watch mode"
	@echo ""
	@echo "Environment variables can be set in docker.env file or exported:"
	@echo "  DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE"
	@echo "  JWT_SECRET, JWT_EXPIRES_IN"
	@echo "  PGADMIN_EMAIL, PGADMIN_PASSWORD"

# Build all images
build:
	docker-compose build
	docker-compose -f docker-compose.dev.yml build

# Production with database
up:
	docker-compose --profile with-db up -d

# Production without database (connect to external DB)
up-no-db:
	docker-compose up -d

# Development with database
dev:
	docker-compose -f docker-compose.dev.yml --profile with-db up -d

# Development without database (connect to external DB)
dev-no-db:
	docker-compose -f docker-compose.dev.yml up -d

# Stop all containers
down:
	docker-compose down
	docker-compose -f docker-compose.dev.yml down

# Show logs
logs:
	docker-compose logs -f

# Clean everything
clean:
	docker-compose down -v --rmi all
	docker-compose -f docker-compose.dev.yml down -v --rmi all
	docker system prune -f

# Setup environment file
setup:
	@if [ ! -f docker.env ]; then \
		echo "Creating docker.env from docker.env.example..."; \
		cp docker.env.example docker.env; \
		echo "Please edit docker.env with your configuration"; \
	else \
		echo "docker.env already exists"; \
	fi

# Database operations
db-migrate:
	docker-compose exec backend npm run migration:run

db-seed:
	docker-compose exec backend npm run seed

db-generate:
	@read -p "Enter migration name: " name; \
	docker-compose exec backend npm run migration:generate -- src/database/migrations/$$name

db-revert:
	docker-compose exec backend npm run migration:revert

# Test commands
test:
	docker-compose exec backend npm test

test-e2e:
	docker-compose exec backend npm run test:e2e

test-watch:
	docker-compose exec backend npm run test:watch

# Health check
health:
	@echo "Checking services health..."
	@curl -f http://localhost:3000/health || echo "Frontend: ❌"
	@curl -f http://localhost:3001/health || echo "Backend: ❌"
	@echo "Health check completed"

# Quick setup for development
dev-setup:
	@echo "Setting up development environment..."
	@make setup
	@make build
	@make dev
	@echo "Waiting for services to start..."
	@sleep 30
	@make db-migrate
	@make db-seed
	@echo "Development environment ready!"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend: http://localhost:3001"
	@echo "PgAdmin: http://localhost:5050" 