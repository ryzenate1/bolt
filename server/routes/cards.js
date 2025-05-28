const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController');
const auth = require('../middleware/auth');

router.get('/', cardController.getAll);
router.get('/:id', cardController.getOne);
router.post('/', auth, cardController.create);
router.delete('/:id', auth, cardController.delete);

module.exports = router; 