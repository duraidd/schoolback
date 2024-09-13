import mongoose from "mongoose";


// Schema
let schema = mongoose.Schema({
    student_class_id: { type: String },
    student_section: { type: String },
    student_rollno: { type: String }
},{ timestamps: true });


let modal = mongoose.model("Studentmark", schema, "Studentmark");


export default modal;