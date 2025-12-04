const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { orderValidator, idValidator } = require('../utils/validators');

// Todas as rotas de pedidos requerem autenticação
router.use(auth);

// POST /api/orders - Criar pedido
router.post('/', orderValidator, orderController.createOrder);

// GET /api/orders - Listar pedidos (filtrado por role)
router.get('/', orderController.getAllOrders);

// GET /api/orders/:id - Obter pedido específico
router.get('/:id', idValidator, orderController.getOrderById);

// PATCH /api/orders/:id/status - Atualizar status (attendant/admin)
router.patch(
  '/:id/status',
  roleCheck('attendant', 'admin'),
  idValidator,
  orderController.updateOrderStatus
);

// DELETE /api/orders/:id - Cancelar pedido
router.delete('/:id', idValidator, orderController.cancelOrder);

module.exports = router;
