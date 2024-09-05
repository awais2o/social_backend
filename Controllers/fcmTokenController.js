const { db: firestore } = require('../config/firebaseConfig')
const admin = require('firebase-admin')

// Controller to handle saving FCM token to Firestore
const saveFcmToken = async (req, res) => {
  const { token, userId } = req.body

  try {
    // Check if token and userId are provided
    if (!token || !userId) {
      return res.status(400).json({ message: 'Token and userId are required.' })
    }

    // Reference to the user document in Firestore
    const userRef = firestore.collection('users').doc(userId)

    // Fetch the user document
    const userDoc = await userRef.get()

    // Check if the document exists
    if (!userDoc.exists) {
      // Create a new document with the token array if the user doesn't exist
      await userRef.set({
        fcmTokens: [token] // Initialize with the token in an array
      })
    } else {
      // Check if the token is already in the array to prevent duplicates
      const userData = userDoc.data()
      if (!userData.fcmTokens || !userData.fcmTokens.includes(token)) {
        // Update the document by adding the new token using arrayUnion
        await userRef.update({
          fcmTokens: admin.firestore.FieldValue.arrayUnion(token)
        })
      }
    }

    // Return success response
    return res.status(200).json({ message: 'FCM token saved successfully' })
  } catch (error) {
    // Log error and return a 500 error response
    console.error('Error saving FCM token:', error)
    return res
      .status(500)
      .json({ message: 'Error saving FCM token', error: error.message })
  }
}

module.exports = { saveFcmToken }
