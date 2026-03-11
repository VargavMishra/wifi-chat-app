const express = require("express")
const http = require("http")
const { Server } = require("socket.io")
const cors = require("cors")

const app = express()
app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: "*"
  }
})

let users = {}

io.on("connection", (socket) => {

  socket.on("join", (username) => {
    users[socket.id] = username
    io.emit("users", users)
  })

  socket.on("sendMessage", (msg) => {
    io.emit("receiveMessage", {
      user: users[socket.id],
      text: msg
    })
  })

  socket.on("disconnect", () => {
    delete users[socket.id]
    io.emit("users", users)
  })

})

server.listen(3001, "0.0.0.0", () => {
  console.log("Chat server running on port 3001")
})