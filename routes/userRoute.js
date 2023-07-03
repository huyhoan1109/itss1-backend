const express = require('express')
const router = express.Router();
const {authUser} = require("../middlewares/auth");
const userController = require('../controllers/userController')

router.get('/teachers', userController.searchTeacher)
router.get('/user', authUser, userController.getUser)
router.post('/user', authUser, userController.postUser)
router.get('/matching', authUser, userController.getMatch)
router.post('/matching', authUser, userController.requestMatch)
router.get('/matching/teacher/:id', authUser, userController.infoMatch)
router.post('/send_otp', userController.sendOtp)
router.post('/check_otp', userController.checkOtp)


module.exports = router;

