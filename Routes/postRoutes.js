const express = require('express')
const {
  createPost,
  toggleLikeDislike,
  createComment
} = require('../Controllers/postController')

const router = express.Router()

router.post('/', createPost)
router.post('/handlelikes', toggleLikeDislike)
router.post('/comment', createComment)

module.exports = router
