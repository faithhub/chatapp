const express = require('express');
const app = express();
const path = require('path');
const detenv = require('dotenv-safe').config({ allowEmptyValues: true });
const appRouter = require('./app/routes/AppRoute');
const flash = require('express-flash')
const eje = require('ejs');
const session = require('express-session')
const passport = require('passport');
const bodyParser = require('body-parser');
const morgan = require('morgan');


// support parsing of application/json type post data
app.use(bodyParser.json());

//Flash
app.use(flash())

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

//morgan
//app.use(morgan('dev'));

//authentication
app.use(session({
    cookie: { maxAge: 60000 },
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())


//template engine
app.set('views', path.join(__dirname, 'app/views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

//routes
app.use('/', appRouter);

//STATIC PUBLIC FILES
app.use(express.static(path.join(__dirname, './app/public')))

//PORT LISTENING
app.listen(process.env.PORT)