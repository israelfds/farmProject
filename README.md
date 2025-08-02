# Farm Management System

Sistema de gerenciamento de fazendas e produtores rurais desenvolvido com NestJS (backend) e React (frontend).

## 🚀 Funcionalidades Implementadas

### ✅ Backend (NestJS)
- **CRUD de Produtores**: Cadastro, edição, exclusão e listagem de produtores rurais
- **Validação de CPF/CNPJ**: Validação automática de documentos usando biblioteca especializada
- **CRUD de Fazendas**: Gerenciamento completo de propriedades rurais
- **Validação de Áreas**: Garantia que a soma das áreas não ultrapasse a área total
- **Gerenciamento de Culturas**: Adição e remoção de culturas plantadas por fazenda
- **Dashboard API**: Endpoints para estatísticas e dados dos gráficos
- **Relacionamentos**: Um produtor pode ter múltiplas fazendas, uma fazenda pode ter múltiplas culturas
- **Validações**: Validação completa de dados com class-validator
- **Documentação**: Swagger/OpenAPI para documentação da API

### ✅ Frontend (React)
- **Interface Moderna**: Design responsivo com Styled Components
- **Gerenciamento de Estado**: Redux Toolkit para estado global
- **Formulários Avançados**: React Hook Form com validação Yup
- **Validação em Tempo Real**: Validação de CPF/CNPJ e áreas no frontend
- **Dashboard Interativo**: Gráficos de pizza com Recharts
- **CRUD Completo**: Interface para todas as operações de produtores e fazendas
- **Gerenciamento de Culturas**: Interface para adicionar/remover culturas plantadas
- **Responsividade**: Interface adaptável para diferentes tamanhos de tela

## 📊 Dashboard

O dashboard exibe:
- **Estatísticas Gerais**: Total de fazendas, produtores, área total e culturas
- **Gráfico por Estado**: Distribuição de fazendas por estado brasileiro
- **Gráfico por Cultura**: Distribuição das culturas plantadas
- **Gráfico de Uso do Solo**: Proporção entre área agricultável e vegetação

## 🛠️ Tecnologias Utilizadas

### Backend
- **NestJS**: Framework Node.js
- **TypeORM**: ORM para banco de dados
- **PostgreSQL**: Banco de dados principal
- **class-validator**: Validação de dados
- **cpf-cnpj-validator**: Validação de documentos
- **Swagger**: Documentação da API

### Frontend
- **React 19**: Biblioteca JavaScript
- **TypeScript**: Tipagem estática
- **Redux Toolkit**: Gerenciamento de estado
- **React Hook Form**: Formulários
- **Yup**: Validação de esquemas
- **Styled Components**: Estilização
- **Recharts**: Gráficos
- **React Router**: Navegação

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- PostgreSQL
- Docker (opcional)

### Backend
```bash
cd backend
npm install
cp env.example .env
# Configure as variáveis de ambiente
npm run start:dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

### Com Docker
```bash
docker-compose up -d
```

## 📋 Requisitos de Negócio Atendidos

✅ **Cadastro, edição e exclusão de produtores rurais**
- Interface completa com formulários validados
- Validação de CPF/CNPJ no frontend e backend
- Confirmação antes de exclusão

✅ **Validação de CPF ou CNPJ**
- Validação automática usando biblioteca especializada
- Formatação automática no frontend
- Validação em tempo real

✅ **Validação de áreas da fazenda**
- Soma das áreas agricultável e vegetação não pode ultrapassar área total
- Validação em tempo real no formulário
- Mensagens de erro claras

✅ **Registro de culturas plantadas**
- Interface para adicionar/remover culturas
- Seleção de safra e tipo de cultura
- Visualização em cards com tags

✅ **Relacionamentos**
- Um produtor pode ter 0, 1 ou mais fazendas
- Uma fazenda pode ter 0, 1 ou mais culturas
- Interface mostra relacionamentos claramente

✅ **Dashboard com estatísticas**
- Total de fazendas cadastradas
- Total de hectares registrados
- Gráficos de pizza por estado, cultura e uso do solo

## 🎨 Interface do Usuário

### Páginas Principais
1. **Dashboard**: Visão geral com estatísticas e gráficos
2. **Produtores**: Lista, cadastro e edição de produtores rurais
3. **Fazendas**: Gerenciamento de propriedades com áreas e culturas

### Características da UI
- **Design Responsivo**: Adaptável para desktop, tablet e mobile
- **Componentes Reutilizáveis**: Arquitetura atomic design
- **Feedback Visual**: Loading states, mensagens de erro/sucesso
- **Acessibilidade**: Labels, tooltips e navegação por teclado
- **Performance**: Lazy loading e otimizações de renderização

## 🔧 Estrutura do Projeto

```
farmProject/
├── backend/                 # API NestJS
│   ├── src/
│   │   ├── producers/       # Módulo de produtores
│   │   ├── farms/          # Módulo de fazendas
│   │   ├── dashboard/      # Módulo de dashboard
│   │   └── common/         # Utilitários compartilhados
│   └── test/               # Testes E2E
└── frontend/               # Aplicação React
    ├── src/
    │   ├── components/     # Componentes React
    │   ├── store/          # Redux store
    │   ├── services/       # Serviços de API
    │   └── utils/          # Utilitários
    └── public/             # Arquivos estáticos
```

## 🧪 Testes

### Backend
```bash
cd backend
npm run test:e2e
```

### Frontend
```bash
cd frontend
npm test
```

## 📝 API Documentation

Acesse a documentação da API em: `http://localhost:3001/api-docs`

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes. 