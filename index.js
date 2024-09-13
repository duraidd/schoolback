import morgan from "morgan";
import express from "express";
import Api from "./Router/Api.js";
import cors from "cors"
import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();





const app = express();



// body-parsel
app.use(express.json());


var whitelist = ['https://schooltask.vercel.app/','https://schooltask.vercel.app','http://localhost:3000']
var corsOptions = {
    origin: function (origin, callback) {

      console.log("origin",origin);

      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    }
  }


app.use(cors(corsOptions));


// Collection
mongoose.connect(process.env.MONGOID).then((res) => { console.log("Database connected"); }).catch((error) => {
    console.log(error);
});


// middleware - > router
app.use("/school", Api);


// log
app.use(morgan("common"));


app.get("/", (req, res) => {
    res.json({ lol: "123" });
});


app.listen(9999);


export default app;