const express = require('express')
const router = express.Router();
const { authTeacher } = require("../middlewares/auth");
const teacherController = require('../controllers/teacherController')

router.get('/', teacherController.filterTeacher)
router.get('/:id', teacherController.infoTeacher)

router.post('/info', authTeacher, teacherController.postTeacher)

module.exports = router;

