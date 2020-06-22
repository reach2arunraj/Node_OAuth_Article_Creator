const express = require("express")
const dotenv = require("dotenv")
const connectDB = require("./config/db")

// Load Config

dotenv.config({ path: "./config/config.env"})

// DB connection

connectDB()

const app = express()

app.listen (process.env.PORT || 3000, () => console.log("server is up and running successfully"))