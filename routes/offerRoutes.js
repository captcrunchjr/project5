var express = require('express');
var router = express.Router({mergeParams: true});
const controller = require('../controllers/offerController');
const {isLoggedIn, isSeller, isNotSeller} = require('../middlewares/auth');
const {validateId} = require('../middlewares/validator');

//router.get('/', isLoggedIn, controller.index);

router.get('/new', isLoggedIn, isNotSeller, controller.new);

router.post('/new', isLoggedIn, isNotSeller, controller.create);

router.get('/viewAll', isLoggedIn, isSeller, controller.viewAll);

router.get('/view/:offerId', isLoggedIn, isSeller, validateId, controller.view);

router.put('/accept/:offerId', isLoggedIn, isSeller, controller.accept);

//router.put('/reject/:id', isLoggedIn, isSeller, controller.reject);

module.exports = router;