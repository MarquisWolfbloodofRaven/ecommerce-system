const { Product } = require('../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

// Listar todos os produtos
exports.getAllProducts = async (req, res) => {
  try {
    const { search, category, sortBy, order } = req.query;
    
    let whereClause = { active: true };
    
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    if (category) {
      whereClause.category = category;
    }
    
    let orderClause = [['createdAt', 'DESC']];
    if (sortBy === 'name') {
      orderClause = [['name', order || 'ASC']];
    } else if (sortBy === 'price') {
      orderClause = [['price', order || 'ASC']];
    }
    
    const products = await Product.findAll({
      where: whereClause,
      order: orderClause
    });

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar produtos.',
      error: error.message
    });
  }
};

// Obter produto por ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado.'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar produto.',
      error: error.message
    });
  }
};

// Criar produto (admin apenas)
exports.createProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Produto criado com sucesso!',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao criar produto.',
      error: error.message
    });
  }
};

// Atualizar produto (admin apenas)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado.'
      });
    }

    await product.update(req.body);

    res.json({
      success: true,
      message: 'Produto atualizado com sucesso!',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar produto.',
      error: error.message
    });
  }
};

// Deletar produto (admin apenas)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado.'
      });
    }

    // Soft delete
    await product.update({ active: false });

    res.json({
      success: true,
      message: 'Produto deletado com sucesso!'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar produto.',
      error: error.message
    });
  }
};
