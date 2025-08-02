# Farm Project Frontend

Frontend React para o sistema de gerenciamento de produtores rurais.

## 🚀 Tecnologias Utilizadas

- **React 18** - Biblioteca JavaScript para interfaces
- **TypeScript** - Tipagem estática
- **Redux Toolkit** - Gerenciamento de estado
- **React Router** - Roteamento
- **Styled Components** - CSS-in-JS
- **Axios** - Cliente HTTP
- **Jest & React Testing Library** - Testes

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn

## 🛠️ Instalação e Configuração

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto:
```env
REACT_APP_API_URL=http://localhost:3000
```

### 3. Iniciar em desenvolvimento
```bash
npm start
```

A aplicação estará disponível em: http://localhost:3000

## 🏗️ Arquitetura

### Estrutura de Pastas (Atomic Design)

```
src/
├── components/
│   ├── atoms/          # Componentes básicos (Button, Input, Card)
│   ├── molecules/      # Combinações de átomos
│   ├── organisms/      # Componentes complexos (Header, Sidebar)
│   ├── templates/      # Layouts (Layout)
│   └── pages/          # Páginas da aplicação
├── store/
│   ├── slices/         # Redux slices
│   └── types/          # Tipos TypeScript
├── services/           # Serviços de API
├── hooks/              # Custom hooks
└── utils/              # Utilitários
```

### Redux Store

- **producers** - Gerenciamento de produtores
- **farms** - Gerenciamento de fazendas
- **dashboard** - Dados do dashboard
- **ui** - Estado da interface (modais, sidebar, tema)

## 🎨 Componentes

### Atoms
- **Button** - Botão com variantes (primary, secondary, danger, success)
- **Input** - Campo de entrada com validação
- **Card** - Container com sombra e hover

### Organisms
- **Header** - Cabeçalho com toggle de tema
- **Sidebar** - Navegação lateral

### Templates
- **Layout** - Layout principal da aplicação

## 📱 Páginas

- **Dashboard** - Visão geral com estatísticas
- **Producers** - Gerenciamento de produtores
- **Farms** - Gerenciamento de fazendas

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm start          # Iniciar servidor de desenvolvimento
npm run build      # Build para produção
npm run test       # Executar testes
npm run eject      # Ejetar configurações (irreversível)
```

## 🧪 Testes

```bash
# Executar testes
npm test

# Executar testes em modo watch
npm test -- --watch

# Executar testes com cobertura
npm test -- --coverage
```

## 🚀 Deploy

### Build para Produção
```bash
npm run build
```

### Servir Build Localmente
```bash
npx serve -s build
```

## 🔗 Integração com Backend

O frontend se conecta ao backend através da API REST:

- **Base URL**: Configurada via `REACT_APP_API_URL`
- **Endpoints**: Documentados no backend
- **Autenticação**: Preparado para JWT (não implementado)

## 🎨 Temas

- **Light** - Tema claro (padrão)
- **Dark** - Tema escuro (toggle no header)

## 📱 Responsividade

A aplicação é responsiva e funciona em:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (até 767px)

## 🔒 Segurança

- Validação de entrada nos formulários
- Sanitização de dados
- Prepared statements via Axios
- CORS configurado no backend

## 🚀 Próximos Passos

- [ ] Implementar autenticação JWT
- [ ] Adicionar formulários completos
- [ ] Implementar filtros e busca
- [ ] Adicionar gráficos no dashboard
- [ ] Implementar upload de imagens
- [ ] Adicionar notificações toast
- [ ] Implementar PWA
- [ ] Adicionar testes E2E com Cypress

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT.
