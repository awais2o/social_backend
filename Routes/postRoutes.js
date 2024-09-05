const express = require('express')
const { createPost } = require('../Controllers/postController')

const router = express.Router()

router.post('/', createPost)

module.exports = router
