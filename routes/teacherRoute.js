const express = require('express')
const router = express.Router();
const { authTeacher } = require("../middlewares/auth");
const teacherController = require('../controllers/teacherController')

router.get('/info/:id', teacherController.infoTeacher)
router.get('/students', authTeacher, teacherController.StudentList)
router.get('/your/info', authTeacher, teacherController.getTeacher)
router.post('/your/info', authTeacher, teacherController.postTeacher)
router.post('/matching', authTeacher, teacherController.updateMatch)

module.exports = router;

