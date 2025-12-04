# 🆘 Troubleshooting & FAQs

Soluções para problemas comuns ao fazer deploy.

---

## ❌ Backend não inicia no Render

### Erro: "Cannot find module './models'"

**Causa:** Caminho dos arquivos incorreto

**Solução:** No Render, a pasta raiz é `/`, então `server.js` deve usar:
```javascript
const { sequelize } = require('./src/models');
```
✅ Já está correto no seu projeto!

---

### Erro: "SASL: client password must be a string"

**Causa:** Variável `DB_PASSWORD` não configurada ou vazia

**Solução:**
1. No Render dashboard → Environment
2. Verificar se `DB_PASSWORD` está lá e não vazio
3. Redeploy

---

### Erro: "Permission denied for schema public"

**Causa:** Usuário PostgreSQL sem permissões

**Solução:**
```sql
-- Execute como user postgres:
GRANT ALL PRIVILEGES ON SCHEMA public TO seu_usuario;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO seu_usuario;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO seu_usuario;
```

---

### Erro: "port 3000 is already in use" (local)

**Causa:** Outra aplicação usando a porta

**Solução:**
```bash
# Matar processo na porta 3000
lsof -i :3000
kill -9 <PID>

# Ou usar porta diferente
PORT=3001 npm start
```

---

## 🖥️ Frontend não conecta ao backend

### Erro: "CORS error" no console

**Causa:** `FRONTEND_URL` no backend não bate com URL real do frontend

**Solução:**
1. Verificar URL real do frontend (ex: `https://seu-username.github.io/ecommerce-system`)
2. No Render environment, atualizar:
   ```
   FRONTEND_URL=https://seu-username.github.io/ecommerce-system
   ```
3. Redeploy
4. Limpar cache do browser (Ctrl+Shift+Delete)

**Debug:**
```javascript
// Abrir DevTools (F12) → Console
// Rodar:
fetch('https://seu-backend/api/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

---

### Erro: "404 - API not found"

**Causa:** `API_URL` apontando para URL errada

**Solução:**
1. Em `frontend/js/api.js`:
   ```javascript
   const API_URL = 'https://seu-app-backend.onrender.com/api';
   // Não pode esquecer o /api no final!
   ```
2. Commit, push, aguardar deploy do frontend

---

### API retorna 500 (Internal Server Error)

**Causa:** Erro no backend

**Solução:**
1. Verificar logs no Render: Dashboard → Logs
2. Procurar stack trace do erro
3. Corrigir no código local, fazer push
4. Render faz auto-deploy

---

## 🔐 Autenticação/JWT

### Erro: "Invalid token"

**Causa:** Token expirado ou JWT_SECRET diferente

**Solução:**
1. Fazer login novamente (pega novo token)
2. Verificar se `JWT_SECRET` é mesmo em dev e prod

---

### Login funciona local mas não online

**Causa:** Banco de dados diferente entre dev/prod

**Solução:**
1. Usuário não existe no banco de produção
2. Registrar novo usuário no site online
3. Depois fazer login

---

## 📊 Banco de dados

### "Database connection timeout"

**Causa:** Banco offline ou credenciais erradas

**Solução:**
1. Testar credenciais localmente:
   ```bash
   psql -h DB_HOST -U DB_USER -d DB_NAME
   ```
2. Se usar Render PostgreSQL, verificar se está ativo
3. Testar ping ao host:
   ```bash
   ping DB_HOST
   ```

---

### Erro ao inserir dados: "Unique violation"

**Causa:** Email já existe no banco

**Solução:**
1. Usar email diferente
2. Ou deletar usuário no banco e tentar novamente

---

### Arquivo de dados perdido

**Solução:**
1. Render PostgreSQL faz backup automático (14 dias)
2. Settings → Backups → restore
3. Ou usar `pg_dump` para backup manual:
   ```bash
   pg_dump -U user -h host database > backup.sql
   ```

---

## 🌐 Deploy/GitHub

### Código não aparece atualizado online

**Causa:** Cache do browser ou deploy não completou

**Solução:**
1. Limpar cache: Ctrl+Shift+Delete (ou Cmd+Shift+Delete no Mac)
2. Abrir em aba anônima/privada
3. Aguardar 2-3 minutos (Render deploy é automático)
4. Verificar logs de deploy no Render

---

### GitHub Pages mostra 404

**Causa:** Pasta `frontend` não selecionada

**Solução:**
1. GitHub → Settings → Pages
2. Source: `main branch / frontend`
3. Salvar
4. Aguardar 1-2 minutos

---

### Render auto-deploy não funciona

**Causa:** Webhook não configurado

**Solução:**
1. Render → Web Service → Settings
2. Verificar "Auto-Deploy" está ativo
3. Ou fazer deploy manual: clique "Deploy"

---

## ⏱️ Performance/Lentidão

### Site demora 20+ segundos para carregar (primeira vez)

**Esperado no Render free tier** - servidor "dorme" após 15 min sem uso

**Solução:**
- Aceitar (é gratuito) ou pagar para uptime contínuo
- Manter ativo com health check a cada 10 min

---

### Backend responde lentamente

**Causa:** Queries do Sequelize são lentas

**Solução:**
1. Verificar logs: `console.log()` antes/depois de queries
2. Adicionar índices no banco:
   ```sql
   CREATE INDEX idx_users_email ON "Users"(email);
   CREATE INDEX idx_products_category ON "Products"(category);
   ```
3. Usar pagination em listas grandes

---

## 🔄 Atualizações de código

### Como fazer deploy de novas features?

```bash
# 1. Fazer mudanças localmente
# 2. Testar tudo funciona
# 3. Commit e push
git add .
git commit -m "Descrição da feature"
git push origin main

# 4. Render redeploy automaticamente (~1 min)
# 5. Frontend redeploy automaticamente no GitHub Pages (~5 min)
```

---

### Como atualizar variáveis de ambiente?

**Opção 1: Sem redeploy (temporário)**
1. Render → Environment
2. Editar valor
3. Salvar (redeploy automático)

**Opção 2: Adicionar ao código**
1. Editar `.env.example`
2. Commit
3. Adicionar em Render Environment
4. Push → redeploy

---

## ❓ FAQs Gerais

### Meu site pode receber quantos usuários?

**Render free tier:**
- ~100 usuários simultâneos
- PostgreSQL: 1 GB armazenamento
- Se crescer, upgrade para pago (~$7/mês)

---

### Posso usar domínio próprio?

Sim! 

**Render:**
1. Comprar domínio (GoDaddy, Namecheap, etc)
2. Render → Custom Domain
3. Adicionar DNS records

**GitHub Pages:**
1. Settings → Pages → Custom domain
2. Adicionar DNS CNAME

---

### Posso adicionar HTTPS?

Sim, automático em Render e GitHub Pages!

---

### Como faço backup dos dados?

```bash
# Backup manual
pg_dump -U seu_user -h host -d database > backup.sql

# Restaurar
psql -U seu_user -h host -d database < backup.sql

# Render: Settings → Backups (automático)
```

---

### Preciso de hospedagem paga?

Não! Gratuito com:
- Render (backend free tier)
- GitHub Pages (frontend)
- Neon.tech (PostgreSQL hobby free)

**Restrições:** Servidor "dorme" se inativo > 15 min

Se quiser uptime 24/7:
- Render paid (~$7/mês)
- DigitalOcean App Platform (~$12/mês)
- AWS/Azure (mais caro)

---

### E se o Render der problema?

Alternativas para backend:
- Railway.app
- Heroku (parou de oferecendo free tier em 2022)
- DigitalOcean
- Fly.io

Mesmos passos, mudam apenas os comandos de deploy.

---

## 📞 Quando pedir ajuda

Se ainda tiver dúvidas:

1. ✅ Leu o `DEPLOY_RENDER.md`? Leia primeiro!
2. ✅ Verificou os logs (Render dashboard ou browser console)?
3. ✅ Testou com curl? 
4. ✅ Limpou cache do browser?

Se mesmo assim não funcionar:
- Paste de erro no Render logs ou browser console
- Descreva: o que você fez, o que esperava, o que aconteceu
- Cheque `.env` tem todas as variáveis necessárias

---

**Você consegue! 💪**
