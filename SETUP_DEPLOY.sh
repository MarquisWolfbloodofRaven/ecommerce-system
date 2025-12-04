#!/bin/bash
# 🚀 SCRIPT DE SETUP - Copie e cole os comandos abaixo conforme necessário

# ============================================
# PASSO 1: Preparar GitHub (altere SEU_USUARIO)
# ============================================

cd /home/dev/Codigos/E-CommerceV3/ecommerce-system

# Substituir SEU_USUARIO por seu nome de usuário GitHub
git init
git remote add origin https://github.com/SEU_USUARIO/ecommerce-system.git
git add .
git commit -m "Initial commit: E-commerce system with backend and frontend - ready for deploy"
git branch -M main
git push -u origin main

# ============================================
# PASSO 2: Gerar chaves criptográficas seguras
# ============================================

# Executar os comandos abaixo e guardar os valores gerados
echo "=== JWT_SECRET (cole em variáveis do Render) ==="
openssl rand -hex 32

echo ""
echo "=== DB_PASSWORD (use algo como isso) ==="
openssl rand -hex 32

# ============================================
# PASSO 3: Crie conta no Render.com (gratuito)
# ============================================

# 1. Ir para https://render.com
# 2. Login com GitHub
# 3. Novo Web Service
#    - Repository: ecommerce-system
#    - Build command: cd backend && npm install
#    - Start command: cd backend && npm start
# 4. Adicionar variáveis de ambiente:
#    NODE_ENV=production
#    PORT=3000
#    FRONTEND_URL=https://seu-username.github.io/ecommerce-system
#    DB_HOST=[Render PostgreSQL host]
#    DB_PORT=5432
#    DB_NAME=ecommerce_db
#    DB_USER=ecommerce_user
#    DB_PASSWORD=[cola valor gerado no passo 2]
#    JWT_SECRET=[cola valor gerado no passo 2]
#    JWT_EXPIRE=7d
#    BCRYPT_ROUNDS=10
#    RATE_LIMIT_WINDOW=15
#    RATE_LIMIT_MAX=100

# ============================================
# PASSO 4: Setup PostgreSQL no Render (opcional)
# ============================================

# Se quiser usar PostgreSQL do Render (gratuito):
# 1. No Render: New + PostgreSQL
# 2. Name: ecommerce-db
# 3. Database: ecommerce_db
# 4. User: ecommerce_user
# 5. Copiar credenciais

# Ou usar Neon.tech (alternativa gratuita):
# https://neon.tech (hobby tier)

# ============================================
# PASSO 5: Atualizar Frontend API_URL
# ============================================

# Editar: frontend/js/api.js
# Mudar linha:
#   const API_URL = 'https://seu-app-backend.onrender.com/api';

# Depois fazer commit:
git add frontend/js/api.js
git commit -m "Update API URL to production backend"
git push

# ============================================
# PASSO 6: Deploy Frontend em GitHub Pages
# ============================================

# 1. GitHub → seu repositório → Settings → Pages
# 2. Source: main branch
# 3. Folder: /frontend
# 4. Save

# Aguardar 2-3 minutos
# Site estará em: https://seu-username.github.io/ecommerce-system/pages/

# ============================================
# PASSO 7: Testar tudo funcionando
# ============================================

# Teste no terminal:
curl https://seu-app-backend.onrender.com/api/health

# Teste no browser:
# https://seu-username.github.io/ecommerce-system/pages/
# 1. Registrar usuário
# 2. Fazer login
# 3. Ver produtos

# ============================================
# COMANDOS ÚTEIS PARA DEPOIS
# ============================================

# Ver logs do backend (Render):
# Dashboard → seu app → Logs

# Redeployer manualmente (Render):
# Dashboard → seu app → Deploy

# Atualizar variáveis de ambiente:
# Dashboard → seu app → Environment → editar

# Fazer backup do banco (PostgreSQL):
pg_dump -U seu_user -h host ecommerce_db > backup.sql

# Restaurar banco do backup:
psql -U seu_user -h host ecommerce_db < backup.sql

# ============================================
# FIM DO SCRIPT
# ============================================

echo "✅ Todos os passos completados!"
echo "Seu e-commerce está online! 🚀"
