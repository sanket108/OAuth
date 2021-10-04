const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys');
const User = require('../models/user-model');

// set to cookie for storage purpose
passport.serializeUser((user, done) => {
    done(null, user.id);// mongodb id --> passing user.id to next stage
});

// when they come back to server from client(cookie), need to get personl info
passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user); // passing user to next stage
    });
});

passport.use(new GoogleStrategy({
    // options for the google strategy
    callbackURL: '/auth/google/redirect',
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret
}, (accessToken, refreshToken, profile, done) => {
    // passport callback function
    console.log('passport callback function fired');

    // check if user already exists in our db

    User.findOne({googleId: profile.id})
    .then((currentUser) => {
        if(currentUser) {
            // already have the user
            console.log('User is already exists: ',currentUser);
            done(null, currentUser); // it is redirect(move on) to passport.serializeUser user method
        } else {
            // if not, create user in our db
            new User({
                username: profile.displayName,
                googleId: profile.id,
                thumbnail: profile._json.image.url
            }).save().then((newUser) => {
                console.log('new user created: '+ newUser);
                done(null, newUser);
            });
        }
    })
})
);

// mlab mongodb
//457069188003-lg8jke4jn9qgrdorhi89kr8vji59m1oh.apps.googleusercontent.com

// yBUYwSODmQ1Tl8Jj0w7QTyVJ