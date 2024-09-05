const admin = require('firebase-admin')
const { db: firestore } = require('../config/firebaseConfig')

// Send notification function to all users
const sendNotificationToAllUsers = async (title, body) => {
  try {
    // Fetch all users and their FCM tokens from Firestore
    const usersSnapshot = await firestore.collection('users').get()

    let allTokens = []
    usersSnapshot.forEach(userDoc => {
      const tokens = userDoc.data().fcmTokens
      if (tokens) {
        allTokens = allTokens.concat(tokens)
      }
    })

    if (allTokens.length === 0) {
      console.log('No FCM tokens found')
      return
    }

    // Create a message object for each token
    const messages = allTokens.map(token => ({
      token: token,
      notification: {
        title: title,
        body: body
      }
    }))

    // Send notifications in batches (e.g., max batch size is 500)
    const BATCH_SIZE = 500
    for (let i = 0; i < messages.length; i += BATCH_SIZE) {
      const batch = messages.slice(i, i + BATCH_SIZE)
      const response = await admin.messaging().sendAll(batch)
      console.log(`Successfully sent batch ${i / BATCH_SIZE + 1}:`, response)
    }
  } catch (error) {
    console.error('Error sending notifications to all users:', error)
  }
}

module.exports = { sendNotificationToAllUsers }
