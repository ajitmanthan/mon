const express = require('express')
const app = express()
const session = require('express-session');
const MongoStore = require('connect-mongo');
app.set('view engine','ejs')
const router = require('./router/router')
require('./db/config')

app.use("/static", express.static('public'));
app.use("/static", express.static("upload"));
app.use(express.urlencoded({extended:true}))
app.use(express.json());



app.use(session({
    cookie: { maxAge: 86400000 },
    store: MongoStore.create({
        mongoUrl: `mongodb+srv:${process.env.DATABASE}`, // Your MongoDB connection string
        collectionName: 'sessions', // Optional: Specify a collection name for sessions
    }),
    resave: false,
    saveUninitialized: false, // Recommended to set this to false for better session handling
    secret: 'keyboard cat' // Your session secret
}));




app.use('/',router)
app.listen(8888)