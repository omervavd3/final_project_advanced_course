import express from "express";
import { aiPrompt } from "../controllers/aiController";
import authController from "../controllers/authController";
const aiRouter = express.Router();

aiRouter.post("/", authController.autMiddleware ,aiPrompt);

export default aiRouter;