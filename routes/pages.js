const express = require('express');
const { indexCtrlFunction, shopCtrlFunction, cartCtrlFunction, aboutCtrlFunction } = require('../controllers/pagesCtrlFile');

const router = express.Router();

router.get('/', indexCtrlFunction);
router.get('/shop', shopCtrlFunction);
router.get('/cart', cartCtrlFunction);
router.get('/about', aboutCtrlFunction);




module.exports = router;