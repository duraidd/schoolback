import mongoose from "mongoose";


// Schema
let schema = mongoose.Schema({
    stu_adm_no:{type:String},
    stu_name:{type:String},
    stu_father_name:{type:String},
    stu_mother_name:{type:String},
    stu_guardian_name:{type:String},
    stu_guard_contactno:{type:String},
    stu_guard_email:{type:String},
    stu_contact_address:{type:String},
    stu_adm_class:{type:String},
    stu_remarks:{type:String}    
},{ timestamps: true });


let modal = mongoose.model("Studentdata", schema, "Studentdata");


export default modal;