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
      res.status(500).send(error);
    }
  }

  async updateItemById(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const { title, content } = req.body;
      let photo = req.body.photo;
      if (!title && !content && !photo) {
        res.status(400).send("No data to update");
        return;
      }
      if (photo && photo.includes("blob:")) {
        photo = photo.replace("blob:", "");
      }
      const updatedItem = await PostModel.findById(id);
      if (!updatedItem) {
        res.status(404).send("Post not found");
        return;
      }
      updatedItem.title = title;
      updatedItem.content = content;
      if (photo) {
        updatedItem.photo = photo;
      }
      await updatedItem.save();
      res.status(200).send(updatedItem);
    } catch (error) {
      res.status(500).send(error);
    }
  }
}

export default new PostController();
