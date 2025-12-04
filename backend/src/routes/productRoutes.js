const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { productValidator, idValidator } = require('../utils/validators');

// GET /api/products - Público (todos podem ver)
router.get('/', productController.getAllProducts);

// GET /api/products/:id - Público
router.get('/:id', idValidator, productController.getProductById);

// POST /api/products - Admin apenas
router.post(
  '/',
  auth,
  roleCheck('admin'),
  productValidator,
  productController.createProduct
);

// PUT /api/products/:id - Admin apenas
router.put(
  '/:id',
  auth,
  roleCheck('admin'),
  idValidator,
  productController.updateProduct
);

// DELETE /api/products/:id - Admin apenas
router.delete(
  '/:id',
  auth,
  roleCheck('admin'),
  idValidator,
  productController.deleteProduct
);

module.exports = router;
