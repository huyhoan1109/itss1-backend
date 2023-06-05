const express = require('express')
const router = express.Router();
const { authUser } = require("../middlewares/auth");
const commentController = require('../controllers/commentController')

router.get('/teacher/:id', commentController.getComment)
router.post('/teacher/:id', authUser, commentController.createComment)
router.post('/:id', authUser, commentController.postComment)
router.delete('/:id', authUser, commentController.delComment)

module.exports = router;

