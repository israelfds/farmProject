# Farm Project - Docker Setup

Este projeto pode ser executado usando Docker e Docker Compose para facilitar o desenvolvimento e deploy.

## 🐳 Configuração Docker

### Pré-requisitos
- Docker
- Docker Compose

### Portas Utilizadas
- **Backend API**: 3001
- **PostgreSQL**: 5432
- **pgAdmin**: 5050

## 🚀 Comandos Disponíveis

### Desenvolvimento com Docker

```bash
# Configurar ambiente de desenvolvimento com Docker
make setup-docker

# Iniciar serviços de desenvolvimento
make docker-dev

# Parar serviços de desenvolvimento
make docker-stop-dev

# Ver logs do ambiente de desenvolvimento
make logs-dev

# Rebuild e reiniciar desenvolvimento
make rebuild-dev
```

### Produção com Docker

```bash
# Deploy em produção
make deploy-prod

# Deploy com Nginx
make deploy-nginx

# Parar produção
make stop-prod

# Ver logs de produção
make logs-prod

# Rebuild e reiniciar produção
make rebuild-prod
```

### Comandos Úteis

```bash
# Health check da API
make health

# Abrir documentação da API
make docs

# Abrir pgAdmin
make pgadmin

# Backup do banco de dados
make backup

# Restaurar backup
make restore
```

## 📁 Arquivos Docker

- `Dockerfile` - Configuração da imagem do backend
- `docker-compose.yml` - Serviços básicos (PostgreSQL + pgAdmin)
- `docker-compose.dev.yml` - Ambiente de desenvolvimento completo
- `docker-compose.prod.yml` - Ambiente de produção
- `docker-compose.nginx.yml` - Produção com Nginx

## 🔧 Configuração do Ambiente

### Variáveis de Ambiente
O arquivo `.env` deve conter:

```env
# Database Configuration
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=farm_producers

# Application Configuration
PORT=3001
NODE_ENV=development
```

### Acessos
- **API**: http://localhost:3001
- **Documentação**: http://localhost:3001/api-docs
- **pgAdmin**: http://localhost:5050
  - Email: admin@farm.com
  - Senha: admin

## 🛠️ Desenvolvimento

### Hot Reload
O ambiente de desenvolvimento (`docker-compose.dev.yml`) inclui:
- Volume montado para hot reload
- Node modules em volume separado
- Comando `npm run start:dev` para desenvolvimento

### Migrations e Seeds
```bash
# Executar migrations
docker-compose -f docker-compose.dev.yml exec app npm run migration:run

# Executar seeds
docker-compose -f docker-compose.dev.yml exec app npm run seed
```

## 🚨 Troubleshooting

### Porta já em uso
Se a porta 3001 estiver em uso:
```bash
# Verificar processos
lsof -i :3001

# Parar processo
kill -9 <PID>
```

### Problemas com banco
```bash
# Resetar banco
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up -d
```

### Rebuild completo
```bash
# Rebuild todas as imagens
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml build --no-cache
docker-compose -f docker-compose.dev.yml up -d
``` 