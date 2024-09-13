import express from "express";
import Api from "./Router/Api.js";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import morgan from "morgan";

dotenv.config();

const app = express();

// Body parser
app.use(express.json());

var whitelist = [
  'https://schooltask.vercel.app',
  'http://localhost:3000'
];

var corsOptions = {
  origin: function (origin, callback) {
    console.log("origin:", origin);

    // Allow undefined origins (for local development tools like Postman)
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: "Content-Type,Authorization",
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Apply CORS middleware with options
app.use(cors(corsOptions));

// Log requests using morgan
app.use(morgan("common"));

// MongoDB connection
mongoose.connect(process.env.MONGOID, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => {
    console.log("Database connection error:", error);
  });

// Routing middleware for your API
app.use("/school", Api);

// Welcome route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the API" });
});

// Handle OPTIONS preflight requests
app.options("*", cors(corsOptions));

// Start server on port 9999
app.listen(9999, () => {
  console.log("Server running on port 9999");
});

export default app;
