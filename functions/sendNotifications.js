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

    // Create a message object for each token
    const messages = tokens.map(token => ({
      token: token,
      notification: {
        title: title,
        body: body
      }
    }))

    // Firebase recommends sending notifications in batches
    const BATCH_SIZE = 500 // Adjust batch size if needed
    for (let i = 0; i < messages.length; i += BATCH_SIZE) {
      const batch = messages.slice(i, i + BATCH_SIZE)
      const response = await admin.messaging().sendEachForMulticast(batch)
      console.log(`Batch ${i / BATCH_SIZE + 1} sent successfully`, response)
    }
  } catch (error) {
    console.error('Error sending message:', error)
  }
}

module.exports = { sendNotification }
