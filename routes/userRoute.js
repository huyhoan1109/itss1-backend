const express = require('express')
const router = express.Router();
const {authUser} = require("../middlewares/auth");
const userController = require('../controllers/userController')

router.post('/login', userController.login);
router.post('/signup', userController.signup)
router.post('/logout', authUser, userController.logout)
router.get('/user', authUser, userController.getUser)
router.post('/user', authUser, userController.postUser)
router.post('/matching', authUser, userController.requestMatch)

module.exports = router;

