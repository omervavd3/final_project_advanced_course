import { Request, Response } from "express";
import LikesModel from "../models/likesModel";
import BaseController from "./baseController";

class LikesController extends BaseController<LikesController> {
    constructor() {
        super(LikesModel);
    }
    async getByUserId(req:Request, res:Response) {
        try {
            const userId = req.params.userId;
            const data = await LikesModel.find({ owner: userId });
            res.status(200).send(data);
        } catch (error) {
            res.status(500).send(error);
        }
    }

    async getByUserAndPost(req:Request, res:Response) {
        try {
            const userId = req.params.userId;
            const postId = req.body.postId;
            const data = await LikesModel.find({ owner: userId, postId: postId });
            if(!data) {
                res.status(404).send("No likes found");
                return;
            }
            res.status(200).send(data)
        } catch (error) {
            res.status(500).send(error);
        }
    }

    async create(req:Request, res:Response) {
        try {
            const postId = req.body.postId;
            const userId = req.params.userId;
            const like = await LikesModel.findOne({ postId: postId, owner: userId });
            if(like) {
                await LikesModel.findByIdAndDelete(like._id);
                res.status(200).send("Like deleted");
                return;
            }
            const newLike = new LikesModel({ postId: postId, owner: userId });
            await newLike.save();
            res.status(201).send(newLike);
        } catch (error) {
            res.status(500).send(error);
        }
    }
}

export default new LikesController();