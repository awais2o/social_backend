const { db } = require('../config/firebaseConfig')
const admin = require('firebase-admin')
const { v4: uuidv4 } = require('uuid')
const {
  sendNotification,
  sendNotificationToAllUsers
} = require('../functions/sendNotifications')

exports.createPost = async (req, res) => {
  const { caption, postURL, uid, displayName, ProfilePhotoURL, likesUID } =
    req.body

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
      likesUID,
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
exports.toggleLikeDislike = async (req, res) => {
  const { postId, uid } = req.body

  if (!postId || !uid) {
    return res.status(400).json({ error: 'postId and uid are required' })
  }

  try {
    const postRef = db.collection('posts').doc(postId)
    const postSnapshot = await postRef.get()

    if (!postSnapshot.exists) {
      return res.status(404).json({ error: 'Post not found' })
    }

    const post = postSnapshot.data()
    let likesUID = post.likesUID || []
    let likesCount = post.likesCount || 0

    // Check if the user has already liked the post
    if (likesUID.includes(uid)) {
      // If the user has already liked the post, remove their uid from the array
      likesUID = likesUID.filter(userUid => userUid !== uid)
      likesCount--
    } else {
      // If the user hasn't liked the post, add their uid to the array
      likesUID.push(uid)
      likesCount++
    }

    // Update the post with the new likesUID and likesCount
    await postRef.update({
      likesUID,
      likesCount
    })

    return res.status(200).json({
      message: 'Post like/dislike updated successfully',
      likesUID,
      likesCount
    })
  } catch (error) {
    console.error('Error updating like/dislike:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
exports.createComment = async (req, res) => {
  const { postId, uid, commentText, username, profilePictureURL } = req.body

  if (!postId || !uid || !commentText || !username) {
    return res
      .status(400)
      .json({ error: 'postId, uid, commentText, and username are required' })
  }

  try {
    const commentId = uuidv4()

    const newComment = {
      uid,
      comment: commentText,
      username,
      createdAt: new Date(),
      profilePictureURL
    }

    // Reference to the specific post's comments subcollection
    const commentsRef = db
      .collection('posts')
      .doc(postId)
      .collection('comments')

    await commentsRef.doc(commentId).set(newComment)

    // Optionally, update the post's comments count
    const postRef = db.collection('posts').doc(postId)
    await postRef.update({
      commentsCount: admin.firestore.FieldValue.increment(1)
    })

    res
      .status(201)
      .json({ message: 'Comment added successfully', comment: newComment })
  } catch (error) {
    console.error('Error creating comment:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
