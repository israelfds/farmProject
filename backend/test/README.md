# Testes E2E - Farm Producers API

Este diretório contém os testes end-to-end (E2E) para a API de Gerenciamento de Produtores Rurais.

## 🚀 Executando os Testes

```bash
# Executar todos os testes E2E
npm run test:e2e

# Executar testes em modo watch
npm run test:e2e -- --watch

# Executar testes com coverage
npm run test:e2e -- --coverage
```

## 📁 Estrutura dos Arquivos

```
test/
├── app.e2e-spec.ts           # Testes básicos da aplicação
├── dashboard.e2e-spec.ts     # Testes do dashboard
├── producers.e2e-spec.ts     # Testes de produtores
├── farms.e2e-spec.ts         # Testes de fazendas
├── clean-db.ts              # Utilitário para limpeza do banco
├── test-app.helper.ts       # Helper para gerenciar aplicação de teste
├── setup-e2e.ts             # Configuração global dos testes
├── jest-e2e.json            # Configuração do Jest para E2E
└── types/
    └── global.d.ts          # Tipos globais para TypeScript
```

## 🔧 Melhorias Implementadas

### 1. **Execução Sequencial**
- Configurado `maxWorkers: 1` no Jest para evitar race conditions
- Testes executam um por vez, garantindo isolamento

### 2. **Gerenciamento Robusto da Aplicação**
- **TestAppHelper**: Singleton que gerencia uma única instância da aplicação
- Evita criação desnecessária de múltiplas instâncias
- Controle de concorrência durante inicialização

### 3. **Limpeza de Banco Melhorada**
- **Sistema de Retry**: 3 tentativas com delay exponencial
- **Verificação de Limpeza**: Confirma se as tabelas estão realmente vazias
- **Logs Detalhados**: Monitoramento do estado do banco

### 4. **Configuração Global**
- **setup-e2e.ts**: Configuração centralizada para todos os testes
- **Timeouts Adequados**: 30 segundos por teste
- **Inicialização Controlada**: Aguarda banco estar pronto

### 5. **Isolamento de Testes**
- Cada teste tem seu próprio estado limpo
- Não há interferência entre testes
- Dados são limpos antes de cada teste

## 🛠️ Arquitetura dos Testes

### TestAppHelper
```typescript
// Singleton que gerencia a aplicação de teste
const helper = TestAppHelper.getInstance();
const app = await helper.createApp();
```

### Limpeza de Banco
```typescript
// Sistema robusto com retry
await cleanDatabase(app); // 3 tentativas automáticas
```

### Estrutura de Teste
```typescript
describe('Controller (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp(); // Usa singleton
  });

  afterAll(async () => {
    await closeTestApp();
  });

  beforeEach(async () => {
    await resetTestDatabase(); // Limpa antes de cada teste
  });

  // Testes aqui...
});
```

## 📊 Resultados Esperados

- **Test Suites**: 4 passed
- **Tests**: 32 passed
- **Tempo**: ~16-17 segundos
- **Consistência**: 100% (sem falhas intermitentes)

## 🔍 Monitoramento

Os testes incluem logs detalhados:
- ✅ Banco de dados limpo com sucesso
- 📊 Tabelas vazias: planted_crops=0, farms=0, producers=0
- ✅ Aplicação de teste criada e inicializada
- ✅ Produtor criado com ID: [uuid]
- ✅ Fazenda criada com ID: [uuid]

## 🚨 Solução de Problemas

### Se os testes falharem:

1. **Verificar Banco de Dados**
   ```bash
   # Verificar se o banco de teste está rodando
   docker ps | grep postgres
   ```

2. **Limpar Manualmente**
   ```bash
   # Se necessário, limpar manualmente
   docker exec -it [container] psql -U postgres -d farm_producers_test -c "TRUNCATE TABLE planted_crops, farms, producers RESTART IDENTITY CASCADE;"
   ```

3. **Reiniciar Containers**
   ```bash
   docker-compose down
   docker-compose up -d
   ```

## 📝 Boas Práticas

1. **Sempre use o TestAppHelper** para criar aplicações
2. **Limpe o banco antes de cada teste** com `resetTestDatabase()`
3. **Use CPFs válidos** nos testes (gerados automaticamente)
4. **Aguarde operações assíncronas** com `await`
5. **Verifique respostas** com assertions específicas

## 🔄 Manutenção

Para adicionar novos testes:

1. Crie o arquivo `[feature].e2e-spec.ts`
2. Use a estrutura padrão com `TestAppHelper`
3. Adicione logs informativos
4. Teste múltiplas vezes para garantir consistência

---

**Status**: ✅ Testes estáveis e consistentes
**Última Atualização**: Dezembro 2024 