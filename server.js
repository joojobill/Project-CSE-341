const express = require('express');
const path = require('path');
const engine = require('ejs-mate');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mongobd = require('./data/database');
const passport = require('passport');
const session = require('express-session');
const GithubStrategy = require('passport-github2').Strategy;
const cors = require('cors');


const port = process.env.PORT || 5000;
const app = express();

app.set('view engine', 'ejs');
app.engine('ejs', engine);
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views')); 


app
    .use(bodyParser.json())
    .use(session({
        secret: "secret",   
        resave: false,
        saveUninitialized: true,
    }))
    // this is the basic express session({..}) initialization
    .use(passport.initialize())
    // init passport on every route call
    .use(passport.session())
    // allow passport to use 'express-session' to manage user sessions
    .use((req, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,  Z-key, Authorization");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        next();
    })
    .use((req, res, next) => {res.locals.user = req.user; next();})
    .use(cors({methds: ['GET', 'POST', 'PUT', 'DELETE', 'UPDATE','PATCH']}))
    .use(cors({origin: '**'}))
    .use("/", require("./routes/index.js"));

passport.use(new GithubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
},
function(accessToken, refreshToken, profile, done){
    // user.findOrCreate({githubId: profile.id}, function (err, user)) {
    return done(null, profile);
}

));passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

//app.get('/', (req, res) => {res.send(req.session.user !== undefined ? `logged in as ${req.session.user.displayName}` : 'Logged out');});

app.get('/auth/github/callback', passport.authenticate('github', { 
    failureRedirect: '/api-docs', session: false}),
    (req, res) => {
        // Successful authentication, redirect home.
        req.session.user = req.user;
        res.redirect('/');
    }
);



mongobd.initDb((err) => {
    if(err) {
        console.log(err);
    }
    else{
        app.listen(port, () => {console.log(`Running on port  ${port}`)});
        
    }
});
 


