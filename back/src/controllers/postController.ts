import PostModel from "../models/postModel";
import BaseController from "./baseController";
import { Request, Response } from "express";

class PostController extends BaseController<typeof PostModel> {
  constructor() {
    super(PostModel);
  }

  async getAllPagination(req: Request, res: Response) {
    try {
      const page = parseInt(req.params.page as string);
      const limit = parseInt(req.params.limit as string);
      if (page < 1 || limit < 1) {
        res.status(400).json({ message: "Invalid page or limit value" });
      }

      const skip = (page - 1) * limit;

      const totalPosts = await PostModel.countDocuments();

      const posts = await PostModel.find()
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit);

      const totalPages = Math.ceil(totalPosts / limit);

      res.json({
        posts,
        totalPages,
        currentPage: page,
        totalPosts,
      });
    } catch (error) {
      console.error("Error fetching paginated posts:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

export default new PostController();
