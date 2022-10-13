const router = require('express').Router();
const passport = require('passport');
// we create different instances of router.

async function controlNext(req,res){
    try{        
        if(req.user){                        
            if(req.user.isAdmin){                
                req.flash('success',"Sign in successfully");
                return res.redirect('/admin/dashboard');
            }
            else{               
                console.log('controlNext2')
                req.flash('success',"Sign in successfully"); 
                return res.redirect('/employee/dashboard');
            }                                           
        }
        else{
            req.flash('error',"Invalid crediential")                           
            res.redirect('/');
        }
    }
    catch(err){
        res.render('error',{"message":"SOme Problem occured"});
    }
}

//auth login
router.get('/login',async(req,res)=>{
    try{
        controlNext(req,res);
    }
    catch(err){
        res.render('error',{"message":err});
    }
})

//auth logout
router.get('/logout',(req,res)=>{
    //handle with passport
    req.logout(function(err){
        if(err){            
            return res.back();
        }
        else{
            req.flash('success','Sign out successfully');
            res.redirect('/');
        }
    })
})

//auth with google 
router.get('/google',passport.authenticate('google',{
    scope:['profile','email']
}))

router.get('/google/redirect',passport.authenticate(
    'google',
    {failureRedirect : '/auth/login'},),async(req,res)=>{
        try{            
            controlNext(req,res);
        }
        catch(err){console.log(err);res.send("some problem occured")}        
    }
)

router.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect : '/auth/login'},
    ),async(req,res)=>{
        try{            
            controlNext(req,res);
        }
        catch(err){
            console.log(err);
            res.send("some problem occured");
        }
})
    
module.exports = router;