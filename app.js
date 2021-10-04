const express = require('express');
const profileRoutes = require('./routes/profile-routes');
const authRoutes = require('./routes/auth-routes');
const passportSetup = require('./config/passport-setup');
const mongoose = require('mongoose');
const keys = require('./config/keys');
// we are encrypt that personal info and send to cookie and at the time of access we again decrpyt
const cookieSession = require('cookie-session');
const passport = require('passport');

const app = express();

// set up view engine
app.set('view engine', 'ejs');

app.use(cookieSession({
    maxAge: 24*60*60*1000,
    keys: [keys.session.cookieKey]
}));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// set up routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

// create home route
app.get('/', (req, res) => {
    res.render('home', {user: req.user}); // rendering template
});

app.listen(3000, () => {
    console.log('app now listing for requests on port 3000');
});

// connect to mongodb
mongoose 
 .connect(keys.mongodb.dbURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
 })   
 .then(() => console.log("Database connected!"))
 .catch(err => console.log(err));