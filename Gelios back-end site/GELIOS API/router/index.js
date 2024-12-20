const { Router } = require("express")
const userController = require('../controllers/user-controller')
const router = new Router();
const {body} = require('express-validator');


router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min:3,max:20}),
    userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.get('/getinfo', userController.getUserInfo);
router.post('/cart/add', userController.addToCart);
router.post('/cart/remove', userController.removeFromCart);
router.get('/cart', userController.getCart);

module.exports=router