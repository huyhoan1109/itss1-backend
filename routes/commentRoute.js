const express = require('express')
const router = express.Router();
const { authUser } = require("../middlewares/auth");
const commentController = require('../controllers/commentController')

router.post('/teacher/:id', commentController.createComment);
router.post('/:id', authUser, commentController.postComment)

module.exports = router;

