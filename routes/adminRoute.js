const express = require('express')
const router = express.Router();
const {authAdmin} = require("../middlewares/auth");
const adminController = require('../controllers/adminController');

router.get('/dashboard', authAdmin, adminController.dashboard)

router.get('/student', authAdmin, adminController.allStudent)
router.get('/teacher', authAdmin, adminController.allTeacher)

router.get('/student/:id', authAdmin, adminController.getStudent)
router.get('/teacher/:id', authAdmin, adminController.getTeacher)

router.post('/student/:id', authAdmin, adminController.postStudent)
router.post('/teacher/:id', authAdmin, adminController.postTeacher)



module.exports = router;

