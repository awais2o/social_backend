require('dotenv').config()
const express = require('express')
const postRoutes = require('./Routes/postRoutes')
const generalRoute = require('./Routes/generalRoute')

const app = express()
const cors = require('cors')

app.use(express.json())
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',')
app.use(
  cors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
  })
)

app.use('/api/posts', postRoutes)
app.use('/api', generalRoute)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
