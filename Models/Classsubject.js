import mongoose from "mongoose";


// Schema
let schema = mongoose.Schema({
    grade: { type: String },
    section: { type: String },
    incharge: { type: String },
    first_lang: { type: String },
    second_lang: { type: String },
    third_lang: { type: String },
    subject1: { type: String },
    subject2: { type: String },
    subject3: { type: String },
    subject4: { type: String },
    subject5: { type: String },
    subject6: { type: String },
    fl_staff_id: { type: String },
    sl_staff_id: { type: String },
    tl_staff_id: { type: String },
    s1_staff_id: { type: String },
    s2_staff_id: { type: String },
    s3_staff_id: { type: String },
    s4_staff_id: { type: String },
    s5_staff_id: { type: String },
    s6_staff_id: { type: String },
    academic_year: { type: String }

},{ timestamps: true });


let modal = mongoose.model("Classsubject", schema, "Classsubject");


export default modal;