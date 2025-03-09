import express from "express";
import { uploadMiddleware, uploadFile, deleteFile, getFile } from "../controllers/multerController";

const multerRouter = express.Router();
multerRouter
    .post("/" ,uploadMiddleware, uploadFile)
    .delete("/:fileName", deleteFile)
    .get("/:fileName", getFile)

export default multerRouter;
