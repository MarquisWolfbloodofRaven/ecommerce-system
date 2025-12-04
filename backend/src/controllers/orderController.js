const { Order, OrderItem, Product, User } = require('../models');
const { validationResult } = require('express-validator');
const sequelize = require('../config/database');

// Criar pedido
exports.createOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { items } = req.body; // [{ productId, quantity }]
    
    if (!items || items.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Carrinho vazio.'
      });
    }

    let total = 0;
    const orderItems = [];

    // Validar e calcular total
    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      
      if (!product || !product.active) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: `Produto ${item.productId} não encontrado.`
        });
      }

      if (product.stock < item.quantity) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: `Estoque insuficiente para ${product.name}. Disponível: ${product.stock}`
        });
      }

      const subtotal = parseFloat(product.price) * item.quantity;
      total += subtotal;

      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
        name: product.name
      });

      // Atualizar estoque
      await product.update(
        { stock: product.stock - item.quantity },
        { transaction }
      );
    }

    // Criar pedido
    const order = await Order.create({
      userId: req.user.id,
      total: total,
      items: orderItems,
      status: 'pending'
    }, { transaction });

    // Criar itens do pedido
    for (const item of orderItems) {
      await OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price
      }, { transaction });
    }

    await transaction.commit();

    res.status(201).json({
      success: true,
      message: 'Pedido criado com sucesso!',
      data: order
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({
      success: false,
      message: 'Erro ao criar pedido.',
      error: error.message
    });
  }
};

// Listar pedidos (com filtros por role)
exports.getAllOrders = async (req, res) => {
  try {
    let whereClause = {};
    
    // Cliente vê apenas seus pedidos
    if (req.user.role === 'client') {
      whereClause.userId = req.user.id;
    }
    // Atendente vê pedidos ativos
    else if (req.user.role === 'attendant') {
      whereClause.status = {
        [Op.notIn]: ['delivered', 'cancelled']
      };
    }
    // Admin vê todos

    const orders = await Order.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        },
        {
          model: OrderItem,
          as: 'orderItems',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'icon']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar pedidos.',
      error: error.message
    });
  }
};

// Obter pedido por ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        },
        {
          model: OrderItem,
          as: 'orderItems',
          include: [
            {
              model: Product,
              as: 'product'
            }
          ]
        }
      ]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado.'
      });
    }

    // Verificar permissão
    if (req.user.role === 'client' && order.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado.'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar pedido.',
      error: error.message
    });
  }
};

// Atualizar status do pedido (attendant/admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado.'
      });
    }

    await order.update({ status });

    res.json({
      success: true,
      message: 'Status do pedido atualizado!',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar pedido.',
      error: error.message
    });
  }
};

// Cancelar pedido
exports.cancelOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [{ model: OrderItem, as: 'orderItems' }]
    });

    if (!order) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado.'
      });
    }

    // Cliente só pode cancelar seus próprios pedidos
    if (req.user.role === 'client' && order.userId !== req.user.id) {
      await transaction.rollback();
      return res.status(403).json({
        success: false,
        message: 'Acesso negado.'
      });
    }

    // Não pode cancelar pedidos já enviados
    if (['shipped', 'delivered'].includes(order.status)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Não é possível cancelar pedidos já enviados ou entregues.'
      });
    }

    // Devolver estoque
    for (const item of order.orderItems) {
      const product = await Product.findByPk(item.productId);
      if (product) {
        await product.update(
          { stock: product.stock + item.quantity },
          { transaction }
        );
      }
    }

    await order.update({ status: 'cancelled' }, { transaction });
    await transaction.commit();

    res.json({
      success: true,
      message: 'Pedido cancelado com sucesso!'
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({
      success: false,
      message: 'Erro ao cancelar pedido.',
      error: error.message
    });
  }
};
