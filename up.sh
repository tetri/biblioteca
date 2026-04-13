#!/bin/bash
# Script de subida do ambiente para colaboradores
echo "🚀 Subindo ambiente Biblioteca..."
docker-compose up -d --build
echo "✅ Ambiente rodando!"
echo "📍 Gateway: http://localhost:80"
echo "📍 Frontend: http://localhost:3000"
