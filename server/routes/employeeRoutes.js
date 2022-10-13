const mongoose = require('mongoose')
const router = require('express').Router();
const Employee = require('../Schema/user');
const passport = require('passport');

const checkAuth = function(req,res,next){    
    if(req.user && req.user.isAdmin==false){        
        next();
    }
    else {        
        res.redirect('/');
    }
}

router.get('/dashboard',checkAuth ,async(req,res)=>{
    try{
        if(req.user.active==false){
            req.logout(function(err){
                if(err){                    
                    return res.redirect('/');
                }            
                else{
                    return res.status(400).render('error',{"message":"Permission Denied"});                
                }
            })        
        }else{
            res.render('employee_dash',
                {
                "username":req.user.username,
                "email" : req.user.emailId,
                "contact":req.user.contact,
                "joining":req.user.joining,
                "department":req.user.department,
                "activity":req.user.activity
                }
            )
        }       
    }
    catch(err){
        console.log(err);
        res.status(400).redirect('/')
    }
});
router.get('/activity',checkAuth ,(req,res)=>{
    try{
        if(req.user.active==false){
            return res.status(400).render('error',{"message":"Permission Denied"});                
        }
        else{
            res.send({"response":req.user.activity});
        }
    }
    catch{
        res.send({"response":"Some Problem occured"});
    }
});

router.post('/addTask',checkAuth,async(req,res)=>{
    try{
        if(req.user.active==false){   
            return res.status(400).render('error',{"message":"Permission Denied"});                                     
        }
        else{
            const start = req.body.start;
            const end = req.body.end;
            const category = req.body.category;
            const description = req.body.description;
            

            //depending on where server is hosted this d should be changed

            var d = Date(Date.now()) ;
            var time1 = d.split(" ")[4].split(":") , time2 = start.split(":");
            var hrs1 = time1[0] , min1 = time1[1];
            var hrs2 = time2[0] , min2 = time2[1];
            // this 19800000 is because server is hosted on USA and UTC time is refered.
            if((hrs2-6)>hrs1 || (hrs1==hrs2 && min2>min1)){
                return res.status(400).render('error',{"message":"Future time cannot be set."});                                     
            }
            var objTask = { start , end , category,description };
            const result = await Employee.findOneAndUpdate(
            { _id: req.user._id }, { $push: { activity: objTask } })                        
            req.flash('success',"Task added.")
            res.redirect('back');
        }
    }
    catch(err){
        console.log(err);
        res.send({"response":"Some problem occur in adding Task"})
    }
})

module.exports = router;
