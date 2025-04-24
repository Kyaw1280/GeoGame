const express = require('express');
const cors = require('cors');
const logger = require('./logger');
const path = require('path')


const userRouter = require('./server/routes/user_routes');
const sessionRouter = require('./server/routes/session_routes');

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(logger)
app.use('/users', userRouter);
app.use('/sessions', sessionRouter);

app.use(express.static(path.join(__dirname, "client")))

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "game.html"));
// })

app.get("/", (req, res) => {
  res.status(200).json({
    title: "Geo-nius",
    description: "Geography games and quizzes to make learning fun!",
  })
})

module.exports = app;
