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

router.get('/dashboard',checkAuth ,(req,res)=>{
    if(req.user.active==false){
        return res.send("Permission Denied");
    }
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
});
router.get('/activity',checkAuth ,(req,res)=>{
    try{
        if(req.user.active==false){
            return res.send("Permission Denied");
        }
        res.send({"response":req.user.activity});
    }
    catch{
        res.send({"response":"Some Problem occured"});
    }
});

router.post('/addTask',checkAuth,async(req,res)=>{
    try{
        if(req.user.active==false){
            return res.send("Permission Denied");
        }
        const start = req.body.start;
        const end = req.body.end;
        const category = req.body.category;
        const description = req.body.description;
        
        var d = Date(Date.now()) ;
        var time1 = d.split(" ")[4].split(":") , time2 = start.split(":");
        var hrs1 = time1[0] , min1 = time1[1];
        var hrs2 = time2[0] , min2 = time2[1];
        if(hrs2>hrs1 || (hrs1==hrs2 && min2>min1)){
            return res.send("Future time cann't be set");
        }
        var objTask = { start , end , category,description };
        const result = await Employee.findOneAndUpdate(
        { _id: req.user._id }, { $push: { activity: objTask } })                        
        
        res.redirect('back');
    }
    catch(err){
        console.log(err);
        res.send({"response":"Some problem occur in adding Task"})
    }
})

module.exports = router;
