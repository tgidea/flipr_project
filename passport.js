const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./server/config/connection');
/*to identify unique user : userfield is used) */
passport.use(new LocalStrategy ({
    usernameField : 'email'
    },
    function(email,password,done){
        //find the user and establish the identity
        User.findOne({"email":email} ,function(err,user){
            if(err){
                console.log(err);
                return done(err);
            }
            if(!user || user.password!=password){
                console.log('Invalid usernam/password');
                //done(no error , but credential not match);
                return done(null,false);
            }
            return done(null,user);
        });
    }
))

passport.serializeUser(function(user,done){
    done(null,user.id);
})

passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        if(err){
            console.log('error in finding ')
            return done(err);
        }
        return done(null,user);
    })
})

passport.checkAuthenticate = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    // if the user is not signed in
    return res.redirect('/');
}

passport.setAuthenticatedUser = function(req,res,next){
    if(req.isAuthenticated()){
        // res.locals.user = req.user.;
    }
}

module.export = passport;