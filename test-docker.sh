#!/bin/bash

echo "🐳 Testando Docker Compose do Farm Management System"
echo "=================================================="

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Inicie o Docker primeiro."
    exit 1
fi

echo "✅ Docker está rodando"

# Verificar se docker-compose está disponível
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose não está instalado."
    exit 1
fi

echo "✅ docker-compose está disponível"

# Criar arquivo .env se não existir
if [ ! -f docker.env ]; then
    echo "📝 Criando docker.env..."
    cp docker.env.example docker.env
    echo "✅ docker.env criado"
else
    echo "✅ docker.env já existe"
fi

# Construir imagens
echo "🔨 Construindo imagens..."
make build

if [ $? -eq 0 ]; then
    echo "✅ Imagens construídas com sucesso"
else
    echo "❌ Erro ao construir imagens"
    exit 1
fi

# Testar produção com banco
echo "🚀 Testando produção com banco interno..."
make up

# Aguardar serviços iniciarem
echo "⏳ Aguardando serviços iniciarem..."
sleep 30

# Verificar saúde dos serviços
echo "🏥 Verificando saúde dos serviços..."
make health

# Parar serviços
echo "🛑 Parando serviços..."
make down

echo "✅ Teste concluído com sucesso!"
echo ""
echo "📋 Comandos disponíveis:"
echo "  make up          - Produção com banco"
echo "  make up-no-db    - Produção sem banco"
echo "  make dev         - Desenvolvimento com banco"
echo "  make dev-no-db   - Desenvolvimento sem banco"
echo "  make down        - Parar todos os serviços"
echo "  make logs        - Ver logs"
echo "  make health      - Verificar saúde" 