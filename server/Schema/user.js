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
// employeeSchema.methods.addActivity = async function(start,end,category,description){
//     try{
//         const obj={            
//             start,
//             end,
//             category,
//             description            
//         }
//         this.activity = this.activity.concat({obj});
//         const dataSave =await this.save();
//         console.log(dataSave);
//         return dataSave;
//     }
//     catch(err){
//         console.log(err);
//         return null;
//     }
// }

const employee = mongoose.model('emplyenew',employeeSchema);
module.exports = employee;