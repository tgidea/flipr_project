const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    username : String,
    emailId :{
        type : String,                
        required:true,
        unique:true,
    },
    "contact" : Number,
    "department" : String,
    "joining" : String,
    password : {
        type : String,
        required:true
    },
    activity:[
        {
            "start"         : String,
            "end"           : Number,
            "category"      : String,
            "description"   : String,
            "time" :{
                type : String,
                default : Date.now()
            }
        }
    ],
    isAdmin:{
        type : Boolean,
        default: false
    },
    "addBy" : String,
    active :{
        type : Boolean,
        default:true
    }
})


const employee = mongoose.model('emplyenew',employeeSchema);
module.exports = employee;