const express = require('express');
const router = express.Router();
const { getExternalProducts, getExternalProductById } = require('../controllers/externalProductController');

router.get('/', getExternalProducts);
router.get('/:id', getExternalProductById);

module.exports = router;