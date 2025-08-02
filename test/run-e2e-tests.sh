#!/bin/bash

echo "🚀 Iniciando testes end-to-end da API..."

# Verificar se o banco está rodando
echo "📊 Verificando se o banco PostgreSQL está rodando..."
if ! docker ps | grep -q farm-postgres; then
    echo "❌ Banco PostgreSQL não está rodando. Iniciando..."
    docker run --name farm-postgres -e POSTGRES_DB=farm_producers -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:16
    echo "⏳ Aguardando banco ficar pronto..."
    sleep 10
fi

# Executar testes
echo "🧪 Executando testes de produtores..."
npm run test:e2e -- --testPathPattern=producers.e2e-spec.ts

echo "🧪 Executando testes de fazendas..."
npm run test:e2e -- --testPathPattern=farms.e2e-spec.ts

echo "🧪 Executando testes do dashboard..."
npm run test:e2e -- --testPathPattern=dashboard.e2e-spec.ts

echo "✅ Testes end-to-end concluídos!" 