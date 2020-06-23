const express = require("express")
const dotenv = require("dotenv")
const morgan = require("morgan")
const path = require("path")
const exphbs = require("express-handlebars")
const connectDB = require("./config/db")
const passport = require("passport")
const session = require("express-session")
const app = express()


// Load Config
dotenv.config({ path: "./config/config.env"})

// Passport config
require("./config/passport")(passport)

// DB connection
connectDB()

//Logging
if(process.env.NODE_ENV === "development"){
    app.use(morgan("dev"))
}

// Handlebars
app.engine('.hbs',exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', '.hbs')

// session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true }
  }))

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Static Folder
app.use(express.static(path.join(__dirname, "public")))


// Routes
app.use("/", require("./routes/index"))
app.use("/auth", require("./routes/auth")) 

app.listen (process.env.PORT || 3000, () => console.log("server is up and running successfully"))   