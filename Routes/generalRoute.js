const express = require('express')
const { saveFcmToken } = require('../Controllers/fcmTokenController') // Import the controller

const router = express.Router()

router.post('/save-fcm-token', saveFcmToken)

module.exports = router
