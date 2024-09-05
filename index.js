require('dotenv').config()
const express = require('express')
const postRoutes = require('./Routes/postRoutes')
const generalRoute = require('./Routes/generalRoute')

const app = express()
const cors = require('cors')

app.use(express.json())
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',')
app.use(
  cors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
  })
)
app.options('*', cors()) // Add this line before your routes

app.use('/api/posts', postRoutes)
app.use('/api', generalRoute)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
