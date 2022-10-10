const mongoose = require('mongoose')
const router = require('express').Router();
const Admin = require('../Schema/admin')
const Employee = require('../Schema/user');
const passport = require('passport');
// we create different instances of router.

//middleware to check admin or not
const checkAuth = function(req,res,next){
    // console.log('in check auth',req.user);
    if(req.user && req.user.isAdmin==true)next();
    else res.redirect('/auth/login');
}

// create new admin
router.post('/signup',async(req,res)=>{
    try{
        const coll = new Admin({
            "username": req.body.name,
            "emailId": req.body.email,
            "password":req.body.password
        })
        await coll.save();
        res.redirect('/auth/login');
    }
    catch(err){
        console.log(err);
        res.send({"response":"Email already exists"})
    }
})

router.get('/dashboard',checkAuth ,async(req,res)=>{
    try{
        const employee = await Employee.find();
        res.render('admin_dash',{"username":req.user.username,"employee":employee});
    }
    catch(err){
        console.log(err);
        res.send('some error occured');
    }
});

router.get('/employee/:id',checkAuth,async(req,res)=>{
    try{
       const id = req.params.id;
       const employeeInfo =  await Employee.findOne({"_id": mongoose.Types.ObjectId(`${id}`)})
       res.render('employee_admin_activity',{"activity":employeeInfo.activity});       
    }
    catch(err){
        console.log(err);
        res.status(403).send({"respones":"Some issue occurs"});
    }
})

//showing employee activity to admin
router.get('/employeeActivity/:id',checkAuth,async(req,res)=>{
    try{
        const id = req.params.id;               
        const employeeInfo =  await Employee.findOne({"_id": mongoose.Types.ObjectId(`${id}`)})
        
        if(employeeInfo)
        res.status(200).send({"response":employeeInfo});
        else
        res.status(403).send({"respones":"Some issue occurs"});
    }
    catch(err){
        console.log(err);
        res.status(403).send({"respones":"Some issue occurs"});
    }
})

// change isActive state
router.get('/removeEmployee/:id',checkAuth,async(req,res)=>{
    try{
       const id = req.params.id;
       const employeeInfo =  await Employee.findOne({"_id": mongoose.Types.ObjectId(`${id}`)});
       var toUpdate = true;
       if(employeeInfo){
        toUpdate = toUpdate^employeeInfo.active;
       }
       await Employee.findOneAndUpdate({emailId:employeeInfo.emailId},{active : toUpdate})
       res.redirect('back');
    }
    catch(err){
        console.log(err);
        res.status(403).send({"respones":"Some issue occurs"});
    }
})

router.post('/addEmployee',checkAuth ,async(req,res)=>{
    try{
        
        if(req.user.isAdmin){
            try{
                const name = req.body.name.toString().trim();
                const email = req.body.email.toString().trim();
                const department = req.body.department.toString().trim();
                const password = req.body.password.toString().trim();
                
                const present1 = await Admin.findOne({"emailId":email});
                const present2 = await Employee.findOne({"emailId":email});

                if(password.length<4)return res.send("Password length<4");
                if(present1 || present2)return res.send("Email Already Exist");

                const collect = new Employee({
                    "username":req.body.name,
                    "emailId" :req.body.email ,
                    "department" : req.body.department,
                    "joining" : req.body.joining,
                    "password" : req.body.password,
                    "contact" : req.body.contact,
                    "addBy" : req.user.username
                });
                await collect.save();
                res.redirect('back');
            }
            catch(err){
                console.log(err);
                res.send("Some error occur while saving employee info.")
            }
        }
        else{
            res.status(400).send("Unauthorized user");
        }
    }
    catch(err){
        console.log(err);
        res.send("some error occured");
    }
});

module.exports = router;