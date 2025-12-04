const { body, param } = require('express-validator');

exports.registerValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Nome é obrigatório')
    .isLength({ min: 3 }).withMessage('Nome deve ter no mínimo 3 caracteres'),
  body('email')
    .trim()
    .notEmpty().withMessage('E-mail é obrigatório')
    .isEmail().withMessage('E-mail inválido')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Senha é obrigatória')
    .isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres'),
  body('role')
    .optional()
    .isIn(['client', 'attendant', 'admin']).withMessage('Role inválida')
];

exports.loginValidator = [
  body('email')
    .trim()
    .notEmpty().withMessage('E-mail é obrigatório')
    .isEmail().withMessage('E-mail inválido')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Senha é obrigatória')
];

exports.productValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Nome do produto é obrigatório'),
  body('description')
    .trim()
    .notEmpty().withMessage('Descrição é obrigatória'),
  body('category')
    .trim()
    .notEmpty().withMessage('Categoria é obrigatória'),
  body('price')
    .notEmpty().withMessage('Preço é obrigatório')
    .isFloat({ min: 0 }).withMessage('Preço deve ser um número positivo'),
  body('stock')
    .notEmpty().withMessage('Estoque é obrigatório')
    .isInt({ min: 0 }).withMessage('Estoque deve ser um número inteiro positivo'),
  body('icon')
    .optional()
    .trim()
];

exports.orderValidator = [
  body('items')
    .isArray({ min: 1 }).withMessage('Carrinho não pode estar vazio'),
  body('items.*.productId')
    .notEmpty().withMessage('ID do produto é obrigatório')
    .isInt().withMessage('ID do produto deve ser um número'),
  body('items.*.quantity')
    .notEmpty().withMessage('Quantidade é obrigatória')
    .isInt({ min: 1 }).withMessage('Quantidade deve ser no mínimo 1')
];

exports.idValidator = [
  param('id')
    .isInt().withMessage('ID inválido')
];
