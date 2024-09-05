const { db: firestore } = require('../config/firebaseConfig')
const admin = require('firebase-admin')

// Controller to handle saving FCM token to Firestore
const saveFcmToken = async (req, res) => {
  const { token, userId } = req.body

  try {
    if (!token || !userId) {
      return res
        .status(400)
        .send('Invalid request. Token and userId are required.')
    }

    // Reference to the user document in Firestore
    const userRef = firestore.collection('users').doc(userId)

    // Fetch the user document
    const userDoc = await userRef.get()

    if (!userDoc.exists) {
      // Create the document if it doesn't exist
      await userRef.set({
        fcmTokens: [token] // Add the token to a new array
      })
    } else {
      // Update the existing document with the new token using arrayUnion to avoid duplicates
      await userRef.update({
        fcmTokens: admin.firestore.FieldValue.arrayUnion(token)
      })
    }

    return res.status(200).json({ message: 'Token saved successfully' })
  } catch (error) {
    console.error('Error saving FCM token:', error)
    return res
      .status(500)
      .json({ message: 'Error saving FCM token', error: error.message })
  }
}

module.exports = { saveFcmToken }
