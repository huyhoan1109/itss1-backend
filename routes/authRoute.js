const express = require('express')
const router = express.Router();
const {authUser} = require("../middlewares/auth");
const authController = require('../controllers/authController')

router.post('/login', authController.login);
router.post('/signup', authController.signup)
router.post('/logout', authUser, authController.logout)

module.exports = router;