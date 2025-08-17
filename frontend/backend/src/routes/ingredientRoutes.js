const express = require('express');
const router = express.Router();
const controller = require('../controllers/ingredientController');

router.post('/', controller.createIngredient);
router.get('/', controller.getAllIngredients);
router.get('/barcode/:barcode', controller.findIngredientByBarcode);
router.patch('/:id/stock', controller.updateIngredientStock);

module.exports = router;