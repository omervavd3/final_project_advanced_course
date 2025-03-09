import express from "express";
import likesController from "../controllers/likesController";
import authController from "../controllers/authController";
import { likesMiddleware } from "../controllers/middlewares";
const likesRouter = express.Router();

likesRouter
  .post(
    "/",
    authController.autMiddleware,
    likesMiddleware,
    likesController.create.bind(likesController)
  )
  .delete(
    "/:id",
    authController.autMiddleware,
    likesController.deleteItemById.bind(likesController)
  )
  .get(
    "/getByUserId",
    authController.autMiddleware,
    likesController.getByUserId.bind(likesController)
  )
  .post(
    "/getByUserAndPost",
    authController.autMiddleware,
    likesController.getByUserAndPost.bind(likesController)
  );

export default likesRouter;
