const passport = require('passport');
const mongoose = require('mongoose');
const GoogleStrategy = require('passport-google-oauth20');
const LocalStrategy = require('passport-local').Strategy;
const path = require('path');
const Admin = require('../Schema/admin');
const Employee = require('../Schema/user');
const rasta = path.join(__dirname,'../config.env');
require('dotenv').config({ path: rasta});


passport.serializeUser((user,done)=>{
    done(null,user.id);    
})

passport.deserializeUser((id,done)=>{
    Admin.findOne({"_id": mongoose.Types.ObjectId(`${id}`)}).then(currentAdmin =>{
        if(currentAdmin){
            done(null,currentAdmin);            
        }
        else{
            // find then employee
            Employee.findById({"_id":mongoose.Types.ObjectId(`${id}`)}).then(currentEmployee =>{
                if(currentEmployee && currentEmployee.active==true){                    
                    done(null,currentEmployee);
                }
                else{
                    console.log('error in des..');
                    done(null,false);
                }
            })
        }        
    })
    .catch(err =>{
        console.log(err);
        done(null,false);
    })
})


// telling passport we gonna use google strategy
passport.use(
    new GoogleStrategy({
    // options for google strategy  
    callbackURL:'/auth/google/redirect',
    clientID : `${process.env.clientID}`,
    clientSecret : `${process.env.clientSecret}`
    },(accessToken,refreshToken,profile,done) =>{
        // passport callback function after google redirect with a code 
        const emailId = profile.emails[0].value;
        
        Admin.findOne({emailId})
        .then((currentAdmin) =>{            
            if(currentAdmin){
                done(null,currentAdmin);               
            }            
            else{
                // find in employee
                Employee.findOne({emailId}).then(currentEmploye =>{
                    if(currentEmploye && currentEmploye.active==true){                        
                        return done(null,currentEmploye);
                    }
                    else{
                        console.log('eroor2');
                        return done(null,false);
                    }
                })
            }
        })
        .catch((err)=>{
            console.log(err);
            return done(null,false);
        })
    })
)

passport.use(new LocalStrategy ({
    usernameField : 'emailId'
    },
    function(emailId,password,done){
        
        //find the user and establish the identity
        Admin.findOne({emailId})
        .then((currentAdmin) =>{            
            if(currentAdmin){
                if(currentAdmin.password!=password){
                    console.log('Invalid Admin username/password');                    
                    return done(null,false);
                }
                return done(null,currentAdmin);               
            }            
            else{
                // find in employee
                Employee.findOne({"emailId":emailId}).then(currentEmploye =>{
                    if(currentEmploye && currentEmploye.active==true){
                        if(currentEmploye.password!=password){
                            console.log('Invalid employee username/password');                            
                            return done(null,false);
                        }
                        return done(null,currentEmploye);
                    }
                    else{
                        console.log('No data found');                        
                        return done(null,false);
                    }
                })
            }
        })
        .catch((err)=>{
            console.log(err);            
            return done(null);
        })
    }
))

module.export = passport;