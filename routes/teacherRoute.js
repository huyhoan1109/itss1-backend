const express = require('express')
const router = express.Router();
const { authTeacher } = require("../middlewares/auth");
const teacherController = require('../controllers/teacherController')

router.get('/info/:id', teacherController.infoTeacher)
router.get('/students', authTeacher, teacherController.StudentList)
router.post('/your/info', authTeacher, teacherController.postTeacher)

module.exports = router;

