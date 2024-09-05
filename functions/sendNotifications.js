const admin = require('firebase-admin')
const { db: firestore } = require('../config/firebaseConfig')

// Send notification function
const sendNotification = async (title, body, userId) => {
  try {
    // Fetch the user's FCM tokens from Firestore
    const userRef = firestore.collection('users').doc(userId)
    const userDoc = await userRef.get()

    if (!userDoc.exists) {
      console.log('User not found')
      return
    }

    const tokens = userDoc.data().fcmTokens

    if (!tokens || tokens.length === 0) {
      console.log('No FCM tokens found for user')
      return
    }

    // Create a message object
    const message = {
      notification: {
        title: title,
        body: body
      },
      tokens: tokens // You can send to multiple tokens at once
    }

    // Send notification
    const response = await admin.messaging().sendMulticast(message)
    console.log('Successfully sent message:', response)
  } catch (error) {
    console.error('Error sending message:', error)
  }
}

module.exports = { sendNotification }
