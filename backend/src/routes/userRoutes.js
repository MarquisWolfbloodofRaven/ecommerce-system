const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { idValidator } = require('../utils/validators');

// Todas as rotas requerem autenticação e role admin
router.use(auth);
router.use(roleCheck('admin'));

// GET /api/users
router.get('/', userController.getAllUsers);

// GET /api/users/:id
router.get('/:id', idValidator, userController.getUserById);

// PUT /api/users/:id
router.put('/:id', idValidator, userController.updateUser);

// DELETE /api/users/:id
router.delete('/:id', idValidator, userController.deleteUser);

module.exports = router;
