const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const mongoose = require('mongoose')
const cookieparser = require('cookie-parser');
const connection = require('./config/connection');
const path  = require('path');
const authRoutes = require('./routes/auth_router');
const adminRoutes = require('./routes/adminRouter')
const employeeRoutes  = require('./routes/employeeRoutes');
const passport = require('passport');
const passportSetUp = require('./config/passport_setup');
const cookieSession = require('cookie-session');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const rasta = path.join(__dirname,'./config.env');
require('dotenv').config({ path: rasta });

app.set('view engine','ejs');

const staticPath  = path.join(__dirname,'../public');
app.use(express.static(staticPath));
app.use('/css',express.static(staticPath));
// app.use(expressLayouts);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieparser());

//mongo store is used to store teh session cookie in the database.
app.use(session({
    name : 'cokoul',
    cookie : {
        maxAge : 72*60*60*1000,
    },
    secret : [`${process.env.SESSIONKEY}`],
    resave : false,
    store : MongoStore.create(
        {    mongoUrl : process.env.DATABASE},
        function(err){
            console.log(err || 'cononect-mongodb-setup-ok');
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session());

//checking everytime user press back button
app.use(function(req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
});

// set up routes
app.get('/',async(req,res)=>{
    try{
        if(req.user){
            if(req.user.isAdmin){
                return res.redirect('/admin/dashboard');
            }
            else if(req.user.isAdmin==false && req.user.active==true){                
                return res.redirect('/employee/dashboard');
            }        
            res.render("login_register");
        }
        else{
            res.render('login_register');             
        }
    }
    catch(err){
        res.send("Some problem happened.")
    }
})
app.use('/auth',authRoutes);
app.use('/admin',adminRoutes);
app.use('/employee',employeeRoutes);

app.listen(5003, () => console.log(`Server started at ${5003}`));