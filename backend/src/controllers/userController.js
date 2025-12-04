const { User } = require('../models');

// Listar todos os usuários (admin apenas)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar usuários.',
      error: error.message
    });
  }
};

// Obter usuário por ID (admin apenas)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado.'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar usuário.',
      error: error.message
    });
  }
};

// Atualizar usuário (admin apenas)
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado.'
      });
    }

    await user.update(req.body);

    res.json({
      success: true,
      message: 'Usuário atualizado com sucesso!',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar usuário.',
      error: error.message
    });
  }
};

// Desativar usuário (admin apenas)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado.'
      });
    }

    await user.update({ active: false });

    res.json({
      success: true,
      message: 'Usuário desativado com sucesso!'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao desativar usuário.',
      error: error.message
    });
  }
};
