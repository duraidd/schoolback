import mongoose from "mongoose";


// Schema
let schema = mongoose.Schema({
    staff_id: { type: String },
    staff_name: { type: String },
    staff_dob: { type: String },
    staff_gender: { type: String },
    staff_qual: { type: String },
    staff_specil_subject: { type: String },
    staff_contact_number: { type: String },
    staff_email_id: { type: String },
    staff_remark: { type: String }

},{ timestamps: true });


let modal = mongoose.model("Teachingstaff", schema, "Teachingstaff");


export default modal;