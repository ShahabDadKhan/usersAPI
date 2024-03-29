import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";

// When you import a folder in TypeScript or JavaScript, it will look for an index.ts or index.js file inside that folder by default.
import router from "./router";

const app = express();
app.use(
  cors({
    credentials: true,
  })
);
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(8080, () => {
  console.log("Server running now, siuuuuuu");
});

require("dotenv").config();
const mongodbPassword = process.env.MONGODB_PASSWORD;

const MONGO_URL = `mongodb+srv://torukmakto:${mongodbPassword}@torukmakto.pndwmyl.mongodb.net/?retryWrites=true&w=majority`;

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on("error", (error: Error) => console.log(error));
app.use("/", router());
