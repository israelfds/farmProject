# 🐳 Farm Management System - Docker Setup

Este projeto pode ser executado usando Docker Compose com diferentes configurações de banco de dados.

## 🚀 Quick Start

### 1. Setup Inicial

```bash
# Copiar arquivo de configuração
cp docker.env.example docker.env

# Editar configurações (opcional)
nano docker.env

# Construir imagens
make build
```

### 2. Executar o Projeto

#### 🏭 **Produção com Banco Interno**
```bash
make up
```
- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- PgAdmin: http://localhost:5050
- PostgreSQL: localhost:5432

#### 🏭 **Produção sem Banco (Banco Externo)**
```bash
make up-no-db
```
- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- Conecta ao banco configurado em `docker.env`

#### 🛠️ **Desenvolvimento com Banco Interno**
```bash
make dev
```
- Frontend: http://localhost:3000 (com hot reload)
- Backend: http://localhost:3001 (com hot reload)
- PgAdmin: http://localhost:5050
- PostgreSQL: localhost:5432

#### 🛠️ **Desenvolvimento sem Banco (Banco Externo)**
```bash
make dev-no-db
```
- Frontend: http://localhost:3000 (com hot reload)
- Backend: http://localhost:3001 (com hot reload)
- Conecta ao banco configurado em `docker.env`

#### 🚀 **Setup Completo para Desenvolvimento**
```bash
make dev-setup
```
- Configura tudo automaticamente (setup, build, dev, migrations, seed)

## 📋 Comandos Disponíveis

### 🐳 **Docker Commands**
```bash
make help          # Mostra todos os comandos
make build         # Constrói todas as imagens
make up            # Produção com banco
make up-no-db      # Produção sem banco
make dev           # Desenvolvimento com banco
make dev-no-db     # Desenvolvimento sem banco
make down          # Para todos os containers
make logs          # Mostra logs
make clean         # Remove tudo (containers, volumes, imagens)
make health        # Verifica saúde dos serviços
```

### 🗄️ **Database Commands**
```bash
make db-migrate    # Executa migrações do banco
make db-seed       # Popula banco com dados de teste
make db-generate   # Gera nova migração
make db-revert     # Reverte última migração
```

### 🧪 **Test Commands**
```bash
make test          # Executa testes unitários
make test-e2e      # Executa testes end-to-end
make test-watch    # Executa testes em modo watch
```

## 🔧 Configuração

### Variáveis de Ambiente (`docker.env`)

```bash
# Configuração do Banco de Dados
DB_HOST=postgres          # Host do banco (postgres para interno)
DB_PORT=5432              # Porta do banco
DB_USERNAME=postgres      # Usuário do banco
DB_PASSWORD=postgres      # Senha do banco
DB_DATABASE=farm_producers # Nome do banco

# Configuração da Aplicação
NODE_ENV=production       # Ambiente (production/development)
JWT_SECRET=your-secret    # Chave JWT
JWT_EXPIRES_IN=24h        # Expiração JWT

# Configuração PgAdmin (apenas com banco interno)
PGADMIN_EMAIL=admin@farm.com
PGADMIN_PASSWORD=admin

# Configuração Frontend
REACT_APP_API_URL=http://localhost:3001
```

### 🔗 Conectando a Banco Externo

Para conectar a um banco PostgreSQL externo:

1. **Configure as variáveis no `docker.env`:**
```bash
DB_HOST=seu-host-externo
DB_PORT=5432
DB_USERNAME=seu-usuario
DB_PASSWORD=sua-senha
DB_DATABASE=seu-banco
```

2. **Execute sem o banco interno:**
```bash
make up-no-db    # Produção
make dev-no-db   # Desenvolvimento
```

## 🗄️ Operações de Banco

### Migrações
```bash
# Executar migrações
make db-migrate

# Gerar nova migração
make db-generate

# Reverter última migração
make db-revert
```

### Seeds (Dados de Teste)
```bash
# Popular banco com dados de exemplo
make db-seed
```

**Dados incluídos no seed:**
- 10 produtores com CPF/CNPJ válidos
- 20 fazendas distribuídas em diferentes estados
- Culturas plantadas variadas (Soja, Milho, Café, etc.)
- Safras de 2020 a 2024

## 🧪 Testes

### Executar Testes
```bash
# Testes unitários
make test

# Testes end-to-end
make test-e2e

# Testes em modo watch (desenvolvimento)
make test-watch
```

### Cobertura de Testes
- **Testes Unitários:** Cobertura de serviços e controllers
- **Testes E2E:** Testes de integração com banco de dados
- **Validações:** CPF/CNPJ, UUID, regras de negócio

## 📊 Acessos

### Com Banco Interno
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **Documentação API:** http://localhost:3001/api-docs
- **Health Check:** http://localhost:3001/health
- **PgAdmin:** http://localhost:5050
  - Email: admin@farm.com
  - Senha: admin
- **PostgreSQL:** localhost:5432

### Sem Banco Interno
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **Documentação API:** http://localhost:3001/api-docs
- **Health Check:** http://localhost:3001/health

## 🔍 Troubleshooting

### Verificar Logs
```bash
make logs
```

### Verificar Saúde dos Serviços
```bash
make health
```

### Limpar Tudo e Recomeçar
```bash
make clean
make build
make up
```

### Problemas Comuns

1. **Porta já em uso:**
   - Altere as portas no `docker.env`
   - Ou pare outros serviços usando as mesmas portas

2. **Banco não conecta:**
   - Verifique as credenciais no `docker.env`
   - Teste a conexão manualmente
   - Verifique se o banco está acessível

3. **Imagens não constroem:**
   - Verifique se o Docker está rodando
   - Execute `make clean` e tente novamente

4. **Migrações falham:**
   - Verifique se o banco está acessível
   - Execute `make db-revert` para reverter migrações problemáticas
   - Verifique logs com `make logs`

5. **Seed falha:**
   - Verifique se as migrações foram executadas
   - Execute `make db-migrate` primeiro
   - Verifique se o banco tem permissões de escrita

## 🏗️ Estrutura dos Arquivos

```
farmProject/
├── docker-compose.yml          # Produção
├── docker-compose.dev.yml      # Desenvolvimento
├── docker.env.example          # Configurações exemplo
├── Makefile                    # Comandos facilitados
├── test-docker.sh              # Script de teste
├── frontend/
│   ├── Dockerfile              # Frontend produção
│   ├── Dockerfile.dev          # Frontend desenvolvimento
│   └── nginx.conf              # Configuração nginx
└── backend/
    ├── Dockerfile              # Backend produção
    ├── Dockerfile.dev          # Backend desenvolvimento
    ├── src/database/
    │   ├── migrations/         # Migrações do banco
    │   ├── seeds/              # Dados de teste
    │   └── seed.ts             # Script de seed
    └── test/                   # Testes
```

## 🚀 Deploy

Para produção, recomenda-se:

1. Configurar variáveis de ambiente seguras
2. Usar banco de dados gerenciado (RDS, etc.)
3. Configurar HTTPS
4. Usar volumes persistentes para dados
5. Configurar monitoramento e logs
6. Executar migrações antes do deploy
7. Configurar backups automáticos 