import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import bodyParser from "body-parser";
import express, { Express } from "express";
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import cors from "cors";
import cookieParser from 'cookie-parser';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
}));


app.use(cookieParser());

import postRouter from "./routes/postRoutes";
import authRouter from "./routes/authRoutes";
import commentRouter from "./routes/commentRoutes";
import multerRouter from "./routes/multerRoutes";
import path from "path";
import likesRouter from "./routes/likesRoutes";
import aiRouter from "./routes/aiRoutes";
app.use("/posts", postRouter);
app.use("/auth", authRouter);
app.use("/comments", commentRouter);
app.use("/file", multerRouter);
app.use("/likes", likesRouter);
app.use("/ai", aiRouter);

//swagger
if (process.env.NODE_ENV == "development") {
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Web Dev 2022 REST API",
        version: "1.0.0",
        description: "REST server including authentication using JWT",
      },
      servers: [{ url: "http://localhost:3000" }],
    },
    apis: ["./src/routes/*.ts"],
  };
  const specs = swaggerJsDoc(options);
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
}

app.use(express.static(path.join(__dirname, "../public")));

const initApp = () => {
  return new Promise<Express>((resolve, reject) => {
    if (!process.env.DB_CONNECT) {
      reject("DB_CONNECT is not defined in .env file");
      // resolve(app);
    } else {
      mongoose
        .connect(process.env.DB_CONNECT)
        .then(() => {
          resolve(app);
        })
        .catch((error) => {
          reject(error);
        });
    }
  });
};

export default initApp;
