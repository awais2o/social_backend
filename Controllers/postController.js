const { db } = require('../config/firebaseConfig')
const { v4: uuidv4 } = require('uuid')
const {
  sendNotification,
  sendNotificationToAllUsers
} = require('../functions/sendNotifications')

exports.createPost = async (req, res) => {
  const { caption, postURL, uid, displayName, ProfilePhotoURL } = req.body

  if (!postURL || !uid) {
    return res
      .status(400)
      .json({ error: 'Caption, postURL, and uid are required' })
  }

  try {
    const postId = uuidv4()

    const newPost = {
      postId,
      ProfilePhotoURL,
      uid,
      displayName,
      caption,
      postURL,
      likesCount: 0,
      commentsCount: 0,
      createdAt: new Date()
    }

    await db.collection('posts').doc(postId).set(newPost)
    sendNotificationToAllUsers(
      'New Post',
      `${displayName} created a new Post`,
      uid
    )
    res
      .status(201)
      .json({ message: 'Post created successfully', post: newPost })
  } catch (error) {
    console.error('Error creating post:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
