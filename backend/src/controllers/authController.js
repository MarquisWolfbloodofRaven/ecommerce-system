const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { validationResult } = require('express-validator');

// Gerar token JWT
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// Registro de usuário
exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, email, password, role } = req.body;

    // Verificar se email já existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'E-mail já cadastrado.'
      });
    }

    // Criar usuário
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'client'
    });

    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: 'Usuário registrado com sucesso!',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao registrar usuário.',
      error: error.message
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Buscar usuário
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'E-mail ou senha incorretos.'
      });
    }

    // Verificar senha
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'E-mail ou senha incorretos.'
      });
    }

    // Verificar se usuário está ativo
    if (!user.active) {
      return res.status(403).json({
        success: false,
        message: 'Usuário desativado. Entre em contato com o suporte.'
      });
    }

    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Login realizado com sucesso!',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao realizar login.',
      error: error.message
    });
  }
};

// Logout (do lado do cliente, apenas informativo)
exports.logout = async (req, res) => {
  res.json({
    success: true,
    message: 'Logout realizado com sucesso!'
  });
};

// Obter usuário atual
exports.getMe = async (req, res) => {
  try {
    res.json({
      success: true,
      data: req.user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao obter dados do usuário.',
      error: error.message
    });
  }
};
