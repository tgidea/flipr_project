const router = require('express').Router();
const passport = require('passport');
// we create different instances of router.

//auth login
router.get('/login',async(req,res)=>{
    try{
        if(req.user){
            if(req.user.isAdmin){
                return res.redirect('/admin/dashboard');
            }
            else if(req.user.isAdmin==false){
                return res.redirect('/employee/dashboard');
            }        
            else{res.render("login_register");}
        }
        else{
            res.render('login_register');
        }
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
        else{res.redirect('/');}
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
            if(req.user.isAdmin){
                return res.redirect('/admin/dashboard');
            }
            else if(req.user.isAdmin==false){
                return res.redirect('/employee/dashboard');
            }        
            else{res.send("Some problem occured");}
        }
        catch(err){console.log(err);res.send("some problem occured")}
        
    }
)

router.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect : '/auth/login'},
    ),async(req,res)=>{
        try{
            if(req.user.isAdmin){
                res.redirect('/admin/dashboard');
            }
            else if(req.user.isAdmin==false){
                res.redirect('/employee/dashboard');
            }
            else{
                res.send("Some problem occured");
            }
        }
        catch(err){
            console.log(err);
            res.send("some problem occured");
        }
})
    
module.exports = router;