# API de Gerenciamento de Produtores Rurais

Esta é uma API RESTful desenvolvida em NestJS para gerenciamento de produtores rurais, fazendas e culturas plantadas. A aplicação segue os princípios de Clean Architecture e implementa todas as regras de negócio especificadas.

## 🚀 Tecnologias Utilizadas

- **NestJS** - Framework para construção de aplicações Node.js escaláveis
- **TypeORM** - ORM para TypeScript e JavaScript
- **PostgreSQL** - Banco de dados relacional
- **class-validator** - Validação de dados
- **Swagger/OpenAPI** - Documentação da API
- **Jest** - Framework de testes
- **Docker** - Containerização
- **Husky** - Git hooks para qualidade de código
- **ESLint & Prettier** - Linting e formatação de código

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- Docker e Docker Compose
- npm ou yarn

## 🛠️ Instalação e Configuração

### 1. Clone o repositório
```bash
git clone <repository-url>
cd farmProject
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
```bash
cp env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=farm_producers

# Application Configuration
PORT=3000
NODE_ENV=development
```

### 4. Inicie o banco de dados
```bash
docker-compose up -d
```

### 5. Execute as migrações (se necessário)
```bash
npm run migration:run
```

### 6. Inicie a aplicação
```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
```

## 📚 Documentação da API

A documentação interativa da API está disponível em:
- **Swagger UI**: http://localhost:3000/api-docs

## 🏗️ Arquitetura da Solução

### Estrutura de Módulos

```
src/
├── producers/           # Módulo de Produtores Rurais
│   ├── entities/
│   ├── dto/
│   ├── producers.controller.ts
│   ├── producers.service.ts
│   └── producers.module.ts
├── farms/              # Módulo de Fazendas
│   ├── entities/
│   ├── dto/
│   ├── farms.controller.ts
│   ├── farms.service.ts
│   └── farms.module.ts
├── dashboard/          # Módulo de Dashboard
│   ├── dashboard.controller.ts
│   ├── dashboard.service.ts
│   └── dashboard.module.ts
├── database/           # Configuração do Banco de Dados
│   ├── database.module.ts
│   └── data-source.ts
├── common/             # Utilitários Comuns
│   ├── decorators/
│   └── pipes/
└── app.module.ts       # Módulo Principal
```

### Modelagem do Banco de Dados

#### Entidade Producer
- `id`: UUID (Primary Key)
- `name`: string
- `document`: string (UNIQUE - CPF ou CNPJ)
- `created_at`: timestamp
- `updated_at`: timestamp

#### Entidade Farm
- `id`: UUID (Primary Key)
- `producer_id`: UUID (Foreign Key)
- `name`: string
- `city`: string
- `state`: string
- `total_area_hectares`: number
- `arable_area_hectares`: number
- `vegetation_area_hectares`: number
- `created_at`: timestamp
- `updated_at`: timestamp

#### Entidade PlantedCrop
- `id`: UUID (Primary Key)
- `farm_id`: UUID (Foreign Key)
- `crop_name`: string
- `harvest_season`: string

## 🔗 Endpoints da API

### Produtores Rurais

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/producers` | Cadastrar um novo produtor |
| GET | `/producers` | Listar todos os produtores |
| GET | `/producers/:id` | Obter dados de um produtor específico |
| PATCH | `/producers/:id` | Atualizar dados de um produtor |
| DELETE | `/producers/:id` | Excluir um produtor |

### Fazendas

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/farms` | Cadastrar uma nova fazenda |
| GET | `/farms` | Listar todas as fazendas |
| GET | `/farms/:id` | Obter dados de uma fazenda específica |
| PATCH | `/farms/:id` | Atualizar dados de uma fazenda |
| DELETE | `/farms/:id` | Excluir uma fazenda |
| POST | `/farms/:farmId/crops` | Adicionar uma cultura a uma fazenda |
| DELETE | `/farms/:farmId/crops/:cropId` | Remover uma cultura de uma fazenda |

### Dashboard

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/dashboard/summary` | Resumo geral das fazendas |
| GET | `/dashboard/farms-by-state` | Dados de fazendas por estado |
| GET | `/dashboard/crops` | Dados de culturas plantadas |
| GET | `/dashboard/land-use` | Dados de uso do solo |

## 🔒 Regras de Negócio Implementadas

### 1. Validação de CPF/CNPJ
- Utiliza a biblioteca `cpf-cnpj-validator`
- Decorator customizado `@IsCpfOrCnpj`
- Validação automática via `ValidationPipe`

### 2. Validação de Área da Fazenda
- A soma das áreas agricultável e de vegetação não pode ser maior que a área total
- Validação implementada no `FarmsService`
- Aplicada tanto na criação quanto na atualização

### 3. Unicidade de Documento
- Cada produtor deve ter um documento único (CPF ou CNPJ)
- Validação no `ProducersService`

## 🧪 Testes

### Executar Testes
```bash
# Testes unitários
npm run test

# Testes em modo watch
npm run test:watch

# Cobertura de testes
npm run test:cov

# Testes e2e
npm run test:e2e
```

### Estrutura de Testes
- **Testes Unitários**: Testam cada serviço isoladamente
- **Testes de Integração**: Testam o fluxo completo da aplicação
- **Dados Mockados**: Utilizam `@faker-js/faker` para dados realistas

## 🐳 Docker

### Comandos Docker
```bash
# Desenvolvimento - Apenas banco de dados
docker-compose up -d

# Produção - Aplicação + Banco
docker-compose -f docker-compose.prod.yml up -d

# Produção com Nginx - Load balancer
docker-compose -f docker-compose.nginx.yml up -d

# Parar serviços
docker-compose down

# Ver logs
docker-compose logs -f

# Reconstruir containers
docker-compose up -d --build
```

### Serviços Disponíveis

#### Desenvolvimento
- **PostgreSQL**: Porta 5432
- **pgAdmin**: Porta 5050 (admin@farm.com / admin)

#### Produção
- **API**: Porta 3000
- **PostgreSQL**: Porta 5432 (interno)
- **Nginx**: Porta 80 (quando usando nginx)

## 📊 Exemplos de Uso

### Criar um Produtor
```bash
curl -X POST http://localhost:3000/producers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "document": "123.456.789-00"
  }'
```

### Criar uma Fazenda
```bash
curl -X POST http://localhost:3000/farms \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Fazenda São João",
    "city": "São Paulo",
    "state": "SP",
    "totalAreaHectares": 1000,
    "arableAreaHectares": 800,
    "vegetationAreaHectares": 200,
    "producerId": "producer-uuid"
  }'
```

### Adicionar uma Cultura
```bash
curl -X POST http://localhost:3000/farms/farm-uuid/crops \
  -H "Content-Type: application/json" \
  -d '{
    "cropName": "Soja",
    "harvestSeason": "Safra 2023"
  }'
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run start:dev      # Iniciar em modo desenvolvimento
npm run start:debug    # Iniciar em modo debug

# Produção
npm run build          # Compilar o projeto
npm run start:prod     # Iniciar em modo produção

# Testes
npm run test           # Executar testes
npm run test:watch     # Executar testes em modo watch
npm run test:cov       # Executar testes com cobertura
npm run test:e2e       # Executar testes end-to-end

# Qualidade de Código
npm run lint           # Executar linter
npm run format         # Formatar código

# Banco de Dados
npm run migration:generate  # Gerar migração
npm run migration:run       # Executar migrações
npm run migration:revert    # Reverter última migração
npm run seed               # Executar seeds
```

## 🚀 Deploy

### Desenvolvimento Local
```bash
# 1. Clone e configure
git clone <repository-url>
cd farmProject
npm install
cp env.example .env

# 2. Inicie o banco
docker-compose up -d

# 3. Execute migrações
npm run migration:run

# 4. Inicie a aplicação
npm run start:dev
```

### Produção com Docker
```bash
# 1. Clone o repositório
git clone <repository-url>
cd farmProject

# 2. Configure as variáveis de ambiente
cp env.example .env
# Edite o .env com as configurações de produção

# 3. Deploy com Docker Compose
docker-compose -f docker-compose.prod.yml up -d

# 4. Execute migrações
docker-compose -f docker-compose.prod.yml exec app npm run migration:run
```

### Produção com Nginx (Load Balancer)
```bash
# Deploy completo com Nginx
docker-compose -f docker-compose.nginx.yml up -d
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Padrões de Commit
O projeto usa [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` novas funcionalidades
- `fix:` correções de bugs
- `docs:` documentação
- `style:` formatação de código
- `refactor:` refatoração
- `test:` testes
- `chore:` tarefas de manutenção

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para suporte, envie um email para suporte@farmproject.com ou abra uma issue no repositório.

---

**Desenvolvido com ❤️ pela equipe Farm Project** 