import mongoose, { Mongoose } from "mongoose";


// Schema
let schema = mongoose.Schema({
    stu_id:{type: mongoose.Types.ObjectId},
    stu_adm_no:{type:String},
    stu_roll_number:{type:String},
    class_no:{type:String},
    class_section:{type:String},
    academic_year:{type:String}
},{ timestamps: true });


let modal = mongoose.model("Studentclassmap", schema, "Studentclassmap");


export default modal;




