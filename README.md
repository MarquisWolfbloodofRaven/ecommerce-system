# 🛒 E-Commerce System

Sistema completo de e-commerce com frontend vanilla JavaScript e backend Node.js/Express com PostgreSQL.

## 📋 Status

- ✅ Backend (Express + Sequelize + PostgreSQL)
- ✅ Frontend (HTML/CSS/JavaScript vanilla)
- ✅ Autenticação (JWT)
- ✅ Painel Admin, Atendente e Cliente
- 🔄 Pronto para deploy online

## 🚀 Quick Start (Local)

### Pré-requisitos
- Node.js 16+ 
- PostgreSQL 12+

### 1. Clonar e instalar dependências

```bash
# Backend
cd backend
npm install

# Frontend (não precisa de npm, é vanilla JS)
cd ../frontend
# Servir arquivos estáticos (ex: com http-server)
npx http-server . -p 5500
```

### 2. Configurar banco de dados

```bash
# Como usuário postgres, criar database e usuário:
sudo -u postgres psql
CREATE DATABASE ecommerce_db;
CREATE USER ecommerce_user WITH PASSWORD 'sua_senha_segura_123';
GRANT ALL PRIVILEGES ON DATABASE ecommerce_db TO ecommerce_user;
\c ecommerce_db
GRANT USAGE, CREATE ON SCHEMA public TO ecommerce_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ecommerce_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ecommerce_user;
```

### 3. Variáveis de ambiente

```bash
# Backend: Copiar .env.example para .env
cp backend/.env.example backend/.env
# Editar backend/.env com suas credenciais
```

### 4. Iniciar

```bash
# Terminal 1: Backend
cd backend
npm run dev  # desenvolvimento com nodemon
# ou
npm start    # produção

# Terminal 2: Frontend
npx http-server frontend -p 5500
# Acessar: http://localhost:5500
```

## 🧪 Testar endpoints

```bash
# Health check
curl http://localhost:3000/api/health

# Registrar usuário
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Cliente Teste",
    "email":"cliente@teste.com",
    "password":"senha123",
    "role":"client"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"cliente@teste.com",
    "password":"senha123"
  }'

# Listar produtos
curl http://localhost:3000/api/products
```

## 📁 Estrutura do Projeto

```
ecommerce-system/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── productController.js
│   │   │   ├── orderController.js
│   │   │   └── userController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── roleCheck.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Product.js
│   │   │   ├── Order.js
│   │   │   └── index.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── productRoutes.js
│   │   │   ├── orderRoutes.js
│   │   │   └── userRoutes.js
│   │   └── utils/
│   │       └── validators.js
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   └── .env (não commitar)
│
├── frontend/
│   ├── pages/
│   │   └── index.html
│   ├── js/
│   │   ├── api.js
│   │   ├── app.js
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── cart.js
│   │   ├── orders.js
│   │   └── admin.js
│   └── css/
│       └── styles.css
│
├── .gitignore
└── README.md
```

## 🔐 Variáveis de Ambiente Necessárias

### Backend (backend/.env)
```
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5500

DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecommerce_db
DB_USER=ecommerce_user
DB_PASSWORD=sua_senha_aqui

JWT_SECRET=chave_secreta_aleatoria
JWT_EXPIRE=7d

BCRYPT_ROUNDS=10
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

## 🌐 Deploy Online

### Opção 1: Render.com (Recomendado - Gratuito)

Ver arquivo `DEPLOY_RENDER.md` para guia completo.

**Resumo:**
1. Push no GitHub
2. Conectar repo em https://render.com
3. Criar Web Service para backend
4. Configurar variáveis de ambiente
5. Deploy automático

### Opção 2: Heroku + GitHub Pages

### Opção 3: DigitalOcean / AWS

## 📚 API Endpoints

### Auth
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login

### Produtos
- `GET /api/products` - Listar produtos
- `POST /api/products` (admin) - Criar produto
- `PUT /api/products/:id` (admin) - Atualizar produto
- `DELETE /api/products/:id` (admin) - Deletar produto

### Pedidos
- `GET /api/orders` - Listar pedidos do usuário
- `POST /api/orders` - Criar pedido
- `PUT /api/orders/:id` (admin) - Atualizar status pedido

### Usuários
- `GET /api/users/:id` - Obter dados do usuário
- `PUT /api/users/:id` - Atualizar usuário

## 🛡️ Segurança

- ✅ Autenticação JWT
- ✅ Senhas com bcrypt (10 rounds)
- ✅ Rate limiting
- ✅ CORS configurado
- ✅ Helmet.js para headers de segurança
- ⚠️ Sempre usar HTTPS em produção
- ⚠️ Manter `.env` fora do repositório

## 🤝 Contribuindo

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

MIT

## ✉️ Contato

[Seu email/contato aqui]
