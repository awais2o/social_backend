const { db } = require('../config/firebaseConfig')
const { v4: uuidv4 } = require('uuid')

exports.createPost = async (req, res) => {
  const { caption, postURL, uid, displayName } = req.body

  if (!caption || !postURL || !uid) {
    return res
      .status(400)
      .json({ error: 'Caption, postURL, and uid are required' })
  }

  try {
    const postId = uuidv4()

    const newPost = {
      postId,
      uid,
      displayName,
      caption,
      postURL,
      likesCount: 0,
      commentsCount: 0,
      createdAt: new Date()
    }

    await db.collection('posts').doc(postId).set(newPost)

    res
      .status(201)
      .json({ message: 'Post created successfully', post: newPost })
  } catch (error) {
    console.error('Error creating post:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
