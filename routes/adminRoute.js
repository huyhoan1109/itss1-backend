const express = require('express')
const router = express.Router();
const {authAdmin} = require("../middlewares/auth");
const adminController = require('../controllers/adminController');

// router.get('/dashboard', authAdmin, adminController.dashboard)
// router.get('/user', authAdmin, adminController.allUser)
// router.get('/user/:id', authAdmin, adminController.getUser)
// router.post('/user/:id', authAdmin, adminController.postUser)

router.get('/dashboard', adminController.dashboard)
router.get('/user', adminController.allUser)
router.get('/student', adminController.allStudent)
router.get('/teacher', adminController.allTeacher)
router.get('/user/:id', adminController.getUser)
router.post('/user/:id', adminController.postUser)

module.exports = router;

