#!/bin/bash
# Script de subida do ambiente para colaboradores
echo "🚀 Subindo ambiente Biblioteca..."

if docker compose up -d --build; then
    echo "✅ Ambiente rodando!"
    echo "📍 Gateway: http://localhost:80"
    echo "📍 Frontend: http://localhost:3000"
else
    echo "❌ Erro ao subir o ambiente. Verifique os logs do Docker."
    exit 1
fi
