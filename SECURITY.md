# 🔐 Guia de Segurança & Produção

Checklist de segurança e configurações antes de colocar online.

## 🔑 Variáveis de Ambiente (Produção)

### Backend (.env em produção)

```bash
# Ambiente
NODE_ENV=production

# Porta (Render atribui automaticamente)
PORT=3000

# CORS - ALTERAR para seu domínio online
FRONTEND_URL=https://seu-username.github.io/ecommerce-system
# ou
FRONTEND_URL=https://seu-site.netlify.app

# Database (usar Render PostgreSQL ou Neon)
DB_HOST=[gerado automaticamente]
DB_PORT=5432
DB_NAME=ecommerce_db
DB_USER=ecommerce_user
DB_PASSWORD=[GERAR SENHA FORTE: min 32 caracteres aleatórios]

# JWT - GERAR CHAVE ALEATÓRIA FORTE (use site abaixo)
JWT_SECRET=[64 caracteres hex aleatórios]
JWT_EXPIRE=7d

# Bcrypt
BCRYPT_ROUNDS=10

# Rate Limiting (proteção contra abuso)
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

### Gerar JWT_SECRET e DB_PASSWORD seguros

```bash
# No terminal Linux/Mac:
openssl rand -hex 32    # Para DB_PASSWORD (64 caracteres)
openssl rand -hex 32    # Para JWT_SECRET (64 caracteres)

# Ou acesse: https://generate-random.org/
```

---

## ✅ Checklist de Segurança

- [ ] `.env` **NÃO** está no Git (verificar `.gitignore`)
- [ ] `JWT_SECRET` é um valor **aleatório e longo** (mínimo 32 caracteres)
- [ ] `DB_PASSWORD` é **forte** (mínimo 16 caracteres, com números/símbolos)
- [ ] `NODE_ENV=production` em produção
- [ ] `FRONTEND_URL` aponta ao domínio **correto** (evita CORS)
- [ ] HTTPS ativado (Render, GitHub Pages, Netlify fazem automaticamente)
- [ ] Rate limiting ativado (padrão: 100 req/15min)
- [ ] Helmet.js ativado (headers de segurança)
- [ ] Validações de entrada em todos os endpoints
- [ ] Senhas criptografadas com bcrypt (já feito)

---

## 🔄 Atualizar secrets no Render

Se precisar mudar `JWT_SECRET` ou `DB_PASSWORD`:

1. No Render dashboard, vá para Web Service
2. **Environment** → editar variáveis
3. Salvar (triggered auto-redeploy)
4. Verificar logs

---

## 🛡️ Outras melhorias de segurança

### 1. HTTPS obrigatório

Backend (adicionar ao `server.js`):
```javascript
// Force HTTPS em produção
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}
```

### 2. Aumentar Rate Limiting em produção

```
RATE_LIMIT_WINDOW=1
RATE_LIMIT_MAX=5
```
(1 minuto, 5 requisições = mais restritivo)

### 3. Validações mais rígidas

Já implementadas em `backend/src/utils/validators.js`

### 4. Logs de auditoria

Recomendado adicionar em futuras versões:
- Login/logout
- Operações de admin
- Erros importantes

---

## 📊 Monitoramento

### Render

1. Dashboard → Web Service
2. **Logs** → ver erros em tempo real
3. **Metrics** → CPU, RAM, requisições

### Frontend

- Browser DevTools → Console (erros de CORS, API)
- Testar endpoints manualmente: `curl https://seu-backend/api/health`

---

## 🚨 Troubleshooting - Erros comuns

### "CORS error" no frontend

**Causa:** `FRONTEND_URL` não bate com URL real do frontend

**Solução:** Verificar em `backend/.env`:
```javascript
FRONTEND_URL=https://seu-username.github.io/ecommerce-system
// não pode ser localhost!
```

### "Invalid JWT"

**Causa:** `JWT_SECRET` diferente entre deployments

**Solução:** Usar mesmo `JWT_SECRET` em todos os deploys
(não gerar novo a cada deploy)

### Banco de dados não conecta

**Causa:** Credenciais incorretas ou host offline

**Solução:**
```bash
# Testar conexão local
psql -h DB_HOST -U DB_USER -d DB_NAME

# Se usar Render PostgreSQL, copiar URL exata
```

### Aplicação dorme (free tier Render)

**Causa:** Render desativa services não usados

**Solução:** 
- Aceitar comportamento (20 segundo delay first load)
- Ou pagar para uptime contínuo

---

## 📱 Backup de dados

### Banco PostgreSQL

```bash
# Fazer dump do banco
pg_dump -U ecommerce_user -h localhost ecommerce_db > backup.sql

# Restaurar
psql -U ecommerce_user -h localhost ecommerce_db < backup.sql
```

No Render, PostgreSQL inclui:
- Automatic backups (14 dias retenção)
- Manual backups (Settings → Backups)

---

## 🔄 Estratégia de deploy

1. **Desenvolvimento** → trabalhar localmente
2. **Staging** (opcional) → branch `staging` no Render
3. **Produção** → branch `main` (auto-deploy)

Branch strategy:

```bash
# Feature work
git checkout -b feature/nova-feature
# ... commit work ...
git push origin feature/nova-feature
# Create PR, review, merge para main

# Main (production) redeploy automaticamente
```

---

**Você está pronto para produção! 🚀**
