import mongoose from "mongoose";


// Schema
let schema = mongoose.Schema({
    exam_id: { type: String },
    exam_name: { type: String },
    class_id: { type: String }

},{ timestamps: true });


let modal = mongoose.model("Examlist", schema, "Examlist");


export default modal;