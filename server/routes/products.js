const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');

router.get('/', productController.getAll);
router.get('/:id', productController.getOne);
router.post('/', auth, productController.create);
router.put('/:id', auth, productController.update);
router.delete('/:id', auth, productController.delete);

module.exports = router; 