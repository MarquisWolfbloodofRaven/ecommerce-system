-- Criação opcional do banco e usuário (se ainda não fez isso fora do psql)
-- CREATE DATABASE ecommerce_db;
-- CREATE USER ecommerce_user WITH PASSWORD 'suasenha';
-- GRANT ALL PRIVILEGES ON DATABASE ecommerce_db TO ecommerce_user;

-- Conectar no banco (no psql)
-- \c ecommerce_db;

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS "Users" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'client',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Tabela de produtos
CREATE TABLE IF NOT EXISTS "Products" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    icon VARCHAR(16) DEFAULT '📦',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Tabela de pedidos
CREATE TABLE IF NOT EXISTS "Orders" (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES "Users"(id) ON DELETE CASCADE,
    total NUMERIC(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    items JSONB NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Tabela de itens de pedido
CREATE TABLE IF NOT EXISTS "OrderItems" (
    id SERIAL PRIMARY KEY,
    "orderId" INTEGER NOT NULL REFERENCES "Orders"(id) ON DELETE CASCADE,
    "productId" INTEGER NOT NULL REFERENCES "Products"(id),
    quantity INTEGER NOT NULL CHECK (quantity >= 1),
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Alguns índices úteis
CREATE INDEX IF NOT EXISTS idx_orders_userId ON "Orders"("userId");
CREATE INDEX IF NOT EXISTS idx_orders_status ON "Orders"(status);
CREATE INDEX IF NOT EXISTS idx_products_category ON "Products"(category);
CREATE INDEX IF NOT EXISTS idx_products_active ON "Products"(active);
