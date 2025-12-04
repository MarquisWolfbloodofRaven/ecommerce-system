# 🚀 Deploy no Render.com - Guia Completo

Neste guia, vamos fazer deploy do backend no Render.com e do frontend no GitHub Pages (ou Netlify).

## ✅ Pré-requisitos

- Conta GitHub (gratuita)
- Conta Render.com (gratuita)
- Seu projeto já pronto e testado localmente

## 📌 Parte 1: Preparar GitHub

### 1.1 Criar repositório no GitHub

1. Acesse https://github.com/new
2. Nome: `ecommerce-system` (ou seu nome preferido)
3. Descrição: "Sistema de E-Commerce com Node.js, Express e PostgreSQL"
4. Visibilidade: **Public** (gratuito) ou Private (pode exigir pagamento para workflows)
5. **NÃO** inicialize com README/gitignore (já temos)
6. Criar repositório

### 1.2 Push do projeto para GitHub

```bash
cd /home/dev/Codigos/E-CommerceV3/ecommerce-system

# Inicializar git (se não estiver já)
git init

# Adicionar remote do seu repositório
git remote add origin https://github.com/SEU_USUARIO/ecommerce-system.git

# Adicionar todos os arquivos (exceto .gitignore)
git add .

# Commit inicial
git commit -m "Initial commit: E-commerce system with backend and frontend"

# Push
git branch -M main
git push -u origin main
```

**Resultado esperado:** Seu código está no GitHub!

---

## 🎯 Parte 2: Deploy do Backend no Render.com

### 2.1 Criar Web Service no Render

1. Acesse https://render.com
2. Faça login ou crie conta (com GitHub é mais rápido)
3. Clique em **New +** → **Web Service**
4. Conecte seu repositório GitHub (autorize o acesso)
5. Selecione `ecommerce-system`
6. Preencha os campos:
   - **Name**: `ecommerce-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: `Free` (gratuito, 0.5 GB RAM, dorme após 15min sem uso)

### 2.2 Configurar variáveis de ambiente

Antes de fazer deploy, configure as variáveis:

1. Na página do Web Service, vá para **Environment**
2. Adicione as seguintes variáveis (copie do seu `.env` local):

```
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://SEU_USERNAME.github.io/ecommerce-system
DB_HOST=[seu_host_postgres]
DB_PORT=5432
DB_NAME=ecommerce_db
DB_USER=ecommerce_user
DB_PASSWORD=sua_senha_super_segura
JWT_SECRET=gere_uma_chave_aleatoria_longa_aqui
JWT_EXPIRE=7d
BCRYPT_ROUNDS=10
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

⚠️ **IMPORTANTE:** Para `DB_HOST`, você pode usar:
- Um banco **PostgreSQL local** (não recomendado em produção)
- **Render PostgreSQL** (clicar em "New +", PostgreSQL)
- **Neon.tech** (PostgreSQL gratuitamente para hobby)

### 2.3 Usar PostgreSQL do Render (Recomendado)

1. No Render, clique **New +** → **PostgreSQL**
2. Preencha:
   - **Name**: `ecommerce-db`
   - **Database**: `ecommerce_db`
   - **User**: `ecommerce_user`
   - **Plan**: `Free`
3. Criar
4. Copiar a **Internal Database URL** (para usar dentro do Render)
5. Na Web Service, adicionar variável `DATABASE_URL` com essa URL

Ou, adicione manualmente:
```
DB_HOST=[gerado pelo Render]
DB_USER=ecommerce_user
DB_PASSWORD=[gerada]
DB_NAME=ecommerce_db
```

### 2.4 Deploy

1. Clique em **Deploy** (ou espere auto-deploy se está em main)
2. Veja os logs em **Logs**
3. Quando disser "Live", copie a URL (ex: `https://ecommerce-backend.onrender.com`)

✅ **Backend online em:** `https://ecommerce-backend.onrender.com`

---

## 🎨 Parte 3: Deploy do Frontend

### Opção A: GitHub Pages (Mais simples)

#### 3A.1 Preparar frontend para GitHub Pages

1. Editar `frontend/js/api.js`:

```javascript
// Mudar de:
const API_URL = 'http://localhost:3000/api';

// Para:
const API_URL = 'https://seu-app-backend.onrender.com/api';
```

2. Commit e push:

```bash
git add frontend/js/api.js
git commit -m "Update API URL to production Render backend"
git push
```

#### 3A.2 Habilitar GitHub Pages

1. No GitHub, vá para **Settings** → **Pages**
2. **Source**: selecione `main branch` → pasta `frontend`
3. Salvar
4. Aguarde 1-2 minutos
5. Link: `https://SEU_USERNAME.github.io/ecommerce-system/pages/`

✅ **Frontend online em:** `https://seu-username.github.io/ecommerce-system/pages/`

---

### Opção B: Netlify (Alternativa, um pouco mais fácil)

1. Acesse https://netlify.com
2. Login com GitHub
3. **New site from Git**
4. Conecte seu repositório
5. **Build command**: deixar vazio (é HTML estático)
6. **Publish directory**: `frontend`
7. Deploy
8. Mudar a URL gerada (Settings → Site details → Change site name)

---

## ✅ Teste de integração online

Após ambos os deploys:

```bash
# Testar health do backend
curl https://seu-app-backend.onrender.com/api/health

# Acessar frontend
# GitHub Pages: https://seu-username.github.io/ecommerce-system/pages/
# Netlify: https://seu-site.netlify.app
```

No frontend (browser), tente:
1. Registrar um novo usuário
2. Fazer login
3. Ver produtos (se houver)
4. Adicionar ao carrinho

---

## 🔄 Atualizações futuras

Sempre que fizer mudanças:

```bash
git add .
git commit -m "Descrição da mudança"
git push origin main
```

- **Backend**: Render faz auto-deploy (~1 min)
- **Frontend**: GitHub Pages atualiza (~5 min)

---

## ⚠️ Troubleshooting

### Backend não conecta ao banco

**Sintoma:** Erro 500 ao acessar `/api/health`

**Solução:**
1. Verificar se PostgreSQL está rodando
2. Testar credenciais: `psql -h DB_HOST -U DB_USER -d DB_NAME`
3. Verificar logs no Render

### Frontend não consegue chamar backend

**Sintoma:** Erro de CORS no browser

**Solução:**
1. Verificar se `API_URL` está correto em `frontend/js/api.js`
2. Backend deve ter CORS ativado (já está no código)
3. Testar: `curl -H "Origin: seu-frontend-url" backend-url/api/health`

### Aplicação dorme no Render (free tier)

**Sintoma:** Primeiro acesso é lento

**Solução:** Normal no free tier (Render dorme services não usados)
- Pagar para ter uptime 24/7
- Ou usar DigitalOcean App Platform (~$12/mês)

---

## 💡 Próximos passos

1. **Adicionar produtos de teste** via painel admin
2. **Testar fluxo completo** de compra
3. **Fazer backup** do banco PostgreSQL
4. **Monitorar logs** para erros
5. **Considerar domain customizado** (adicionar domínio próprio)

---

## 🔗 Links úteis

- Render.com: https://render.com
- Neon.tech (PostgreSQL grátis): https://neon.tech
- GitHub Pages docs: https://pages.github.com
- Netlify: https://netlify.com

---

**Pronto! Seu e-commerce está online! 🎉**
