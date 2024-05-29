const router = require('express').Router();
const {jwtMiddleware} = require('../jwtAuth');
const userController = require('../controllers/userController');

router.post('/signup' , userController.signup);

router.post('/login', userController.signIn);

router.get('/profile', jwtMiddleware, userController.profile);

router.put('/profile/:profileId', jwtMiddleware, userController.updateProfile);

module.exports = router;