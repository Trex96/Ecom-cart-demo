const express = require('express');
const router = express.Router();
const { getExternalProducts } = require('../controllers/externalProductController');


router.get('/external', getExternalProducts);

module.exports = router;