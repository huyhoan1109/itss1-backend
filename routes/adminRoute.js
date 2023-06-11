const express = require('express')
const router = express.Router();
const {authAdmin} = require("../middlewares/auth");
const adminController = require('../controllers/adminController');

router.get('/dashboard', authAdmin, adminController.dashboard)
router.get('/user', authAdmin, adminController.allUser)
router.get('/user/:id', authAdmin, adminController.getUser)
router.post('/user/:id', authAdmin, adminController.postUser)

module.exports = router;

