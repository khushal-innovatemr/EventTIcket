const express = require('express');
const cors = require('cors');
const app = express();
const router = require('./controllers/routers')
const routes = require('./controllers/event_router')
const PORT = 3000;
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');


app.use(express.json())
app.use(cors({
    origin: 'http://localhost:4200',
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    credentials: true
}));

app.use(session({
    secret: process.env.SESSION_SECRET || 'your_session_secret',
    resave: false,
    saveUninitialized: false,

}));

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());


app.use('/auth', router);
app.use('/event',routes)

app.get('/',(req,res) => {
    res.send("Hello Ji")
})
app.listen(PORT, () => {
    console.log(`App has started on port ${PORT}`);
});