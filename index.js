import morgan from "morgan";
import express from "express";
import Api from "./Router/Api.js";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// body-parser
app.use(express.json());

var whitelist = [
  'https://schooltask.vercel.app/',
  'https://schooltask.vercel.app',
  'http://localhost:3000'
];

var corsOptions = {
  origin: function (origin, callback) {
    console.log("origin", origin);

    // Allow undefined origins (for local development tools like Postman)
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));

// Collection
mongoose.connect(process.env.MONGOID)
  .then(() => { 
    console.log("Database connected");
  })
  .catch((error) => {
    console.log(error);
  });

// middleware - > router
app.use("/school", Api);

// log
app.use(morgan("common"));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the API" });
});

app.listen(9999, () => {
  console.log("Server running on port 9999");
});

export default app;
