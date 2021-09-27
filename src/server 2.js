require("./database")

const express = require("express")
const userRouter = require("./routers/user")
const imageRouter = require("./routers/image")
const upvoteRouter = require("./routers/upvote")

const server = express()

// JSON HTTP Request Middleware
server.use(express.json())

// Routers
server.use(userRouter)
server.use(imageRouter)
server.use(upvoteRouter)

module.exports = server