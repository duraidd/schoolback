import mongoose from "mongoose";


// Schema
let schema = mongoose.Schema({
    student_class: { type: String },
    student_section: { type: String },
    student_rollno: { type: String },
    student_name: { type: String },
    student_exam_term: { type: String },
    tamil: { type: Number },
    english: { type: Number },
    maths: { type: Number },
    science: { type: Number },
    social: { type: Number },
    language1: { type: Number },
    language2: { type: Number },
    total: { type: Number },
    percentage: { type: Number }
}, { timestamps: true });


let modal = mongoose.model("Studentmark", schema, "Studentmark");


export default modal;