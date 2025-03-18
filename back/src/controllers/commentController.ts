import { Request, Response } from "express";
import CommentModel from "../models/commentsModel";
import BaseController from "./baseController";

class CommentController extends BaseController<CommentController> {
    constructor() {
        super(CommentModel);
    }

    async getByPostId(req: Request, res: Response) {
        try {
            const postId = req.params.postId;
            const page = parseInt(req.params.page as string);  
            const limit = parseInt(req.params.limit as string); 
    
            const skip = (page - 1) * limit; 
    
            const comments = await CommentModel.find({ postId: postId })
                .sort({ date: -1 }) 
                .skip(skip)
                .limit(limit);
    
            const totalComments = await CommentModel.countDocuments({ postId: postId });
    
            res.status(200).json({
                comments,
                totalComments,
                totalPages: Math.ceil(totalComments / limit),
                currentPage: page,
            });
        } catch (error) {
            res.status(500).send(error);
        }
    }
    
}

export default new CommentController();