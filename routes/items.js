var express = require('express');
var router = express.Router();
const controller = require('../controllers/itemController');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const {isLoggedIn, isSeller} = require('../middlewares/auth');
const {validateId} = require('../middlewares/validator');
const offerRoutes = require('./offerRoutes');

/* GET items listing. */
router.get('/', controller.index);

router.get('/search', controller.search);

router.get('/search/:term', controller.searchTerm);

router.get('/new', isLoggedIn, controller.new);

router.post('/new', isLoggedIn, controller.create);

router.get('/view/:id', validateId, controller.view);

router.delete('/delete/:id', isLoggedIn, validateId, isSeller, controller.delete);

router.get('/edit/:id', isLoggedIn, validateId, isSeller, controller.edit);

router.put('/edit/:id', isLoggedIn, validateId, isSeller, controller.update);

router.use('/:id/offer', offerRoutes);

module.exports = router;
