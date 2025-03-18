import { Request, Response, NextFunction } from "express";
import LikesModel from "../models/likesModel";
import CommentModel from "../models/commentsModel";
import PostModel from "../models/postModel";
import UserModel from "../models/userModel";
import bcrypt from "bcrypt";
import { deleteFile } from "./multerController";
import multer from "multer";
import path from "path";
import fs from "fs";

export const deleteImageMiddleware = async (
  filename: string
): Promise<boolean> => {
  try {
    if (!filename) {
      return false;
    }
    let fileName = filename;
    let filePath = path.join(__dirname, "../public", fileName);

    filePath = filePath.replace("src\\", "").replace(/\\/g, "/");

    console.log("File path to delete:", filePath);

    fs.exists(filePath, (exists) => {
      if (!exists) {
        return false;
      }

      fs.unlink(filePath, (err) => {
        if (err) {
          console.log("Error deleting file:", err);
          return false;
        }
        console.log("File deleted successfully");
        return true;
      });
    });
    return true;
  } catch (error) {
    return false;
  }
};

export const commentDeleteMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.params.userId;
    const commentId = req.params.id;
    const comment = await CommentModel.findById(commentId);
    if (!comment) {
      res.status(404).send("Comment not found");
      return;
    }
    const post = await PostModel.findById(comment.postId);
    if (!post) {
      res.status(404).send("Post not found");
      return;
    }
    if (post.owner !== userId && comment.owner !== userId) {
      res.status(403).send("Unauthorized");
      return;
    }
    next();
  } catch (error) {
    res.status(500).send(error);
  }
};

export const commentEditMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.params.userId;
    const commentId = req.params.id;
    const comment = await CommentModel.findById({ _id: commentId });
    if (!comment) {
      res.status(404).send("Comment not found");
      return;
    }
    if (comment.owner !== userId) {
      res.status(403).send("Unauthorized");
      return;
    }
    next();
  } catch (error) {
    res.status(500).send(error);
  }
};

export const postMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.params.userId;
    const postId = req.params.id;
    const photo = req.body.photo;
    const post = await PostModel.findById(postId);
    if (!post) {
      res.status(404).send("Post not found");
      return;
    }
    if (post.owner !== userId) {
      res.status(403).send("Unauthorized");
      return;
    }
    if (photo) {
      const photoForDelte = post.photo;
      if (photoForDelte) {
        const fileName = photoForDelte.split("/").pop() || "";
        const imageDelte = await deleteImageMiddleware(fileName);
        if (!imageDelte) {
          res.status(500).send("Error deleting image");
          return;
        }
      }
    }
    next();
  } catch (error) {
    res.status(500).send(error);
  }
};

export const postDeleteMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const postId = req.params.id;
    const user = await UserModel.findById(req.params.userId);
    if (!user) {
      res.status(404).send("User not found");
      return;
    }
    const post = await PostModel.findById(postId);
    if (!post) {
      res.status(404).send("Post not found");
      return;
    }
    if(post.owner !== user.id) {
      res.status(403).send("Unauthorized");
      return;
    }
    const photo = post.photo;
    if (photo) {
      const fileName = photo.split("/").pop() || "";
      const imageDelete = await deleteImageMiddleware(fileName);
      if (imageDelete == false) {
        res.status(500).send("Error deleting image");
        return;
      }
    }
    const comments = await CommentModel.find({ postId: postId });
    if (comments.length > 0) {
      await CommentModel.deleteMany({ postId: postId });
    }
    const likes = await LikesModel.find({ postId: postId });
    if (likes.length > 0) {
      await LikesModel.deleteMany({
        postId: postId,
      });
    }
    next();
  } catch (error) {
    res.status(500).send(error);
  }
};

export const authUpdateMiddleWare = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const password = req.body.password;
    const userId = req.params.userId;
    const profileImageUrl = req.body.profileImageUrl;
    const userName = req.body.userName;
    const user = await UserModel.findById(userId);
    if (!user) {
      res.status(404).send("User not found");
      return;
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      res.status(402).send("Invalid password");
      return;
    }
    if (profileImageUrl) {
      const profileImageUrlForDelete = user.profileImageUrl;
      if (profileImageUrlForDelete) {
        const fileName = profileImageUrlForDelete.split("/").pop() || "";
        const imageDelete = await deleteImageMiddleware(fileName);
        if (!imageDelete) {
          res.status(500).send("Error deleting image");
          return;
        }
      }
      const posts = await PostModel.find({ owner: userId });
      if (posts.length > 0) {
        posts.forEach(async (post) => {
          post.ownerPhoto = profileImageUrl;
          await post.save();
        });
      }
    }
    if (userName) {
      const posts = await PostModel.find({ owner: userId });
      if (posts.length > 0) {
        posts.forEach(async (post) => {
          post.ownerName = userName;
          await post.save();
        });
      }
      const comments = await CommentModel.find({ owner: userId });
      if (comments.length > 0) {
        comments.forEach(async (comment) => {
          comment.ownerName = userName;
          await comment.save();
        });
      }
    }
    next();
  } catch (error) {
    res.status(500).send(error);
  }
};

export const authUpdatePasswordMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.params.userId;
    const oldPassword = req.body.oldPassword;
    const user = await UserModel.findById(userId);
    if (!user) {
      res.status(404).send("User not found");
      return;
    }
    const valid = await bcrypt.compare(oldPassword, user.password);
    if (!valid) {
      res.status(402).send("Invalid password");
      return;
    }
    next();
  } catch (error) {
    res.status(500).send(error);
  }
};

export const authDeleteMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.params.userId;
    const password = req.body.password;
    if (!password) {
      res.status(404).send("Password is required");
      return;
    }
    const user = await UserModel.findById(userId);
    if (user == null) {
      res.status(404).send("User not found");
      return;
    }
    console.log(user.password);
    if (user.password != "google-signin") {
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        res.status(402).send("Invalid password");
        return;
      }
      const profileImageUrlForDelete = user.profileImageUrl;
      if (profileImageUrlForDelete) {
        const fileName = profileImageUrlForDelete.split("/").pop() || "";
        const imageDelete = await deleteImageMiddleware(fileName);
        if (!imageDelete) {
          res.status(500).send("Error deleting image");
          return;
        }
      }
    }
    const comments = await CommentModel.find({ owner: userId });
    if (comments.length > 0) {
      await CommentModel.deleteMany({ owner: userId });
    }
    const likes = await LikesModel.find({ owner: userId });
    if (likes.length > 0) {
      likes.forEach(async (like) => {
        const post = await PostModel.find({ _id: like.postId });
        post[0].likes -= 1;
        await post[0].save();
      });
      await LikesModel.deleteMany({ owner: userId });
    }
    const posts = await PostModel.find({ owner: userId });
    if (posts.length > 0) {
      posts.forEach(async (post) => {
        const likesForPost = await LikesModel.find({ postId: post._id });
        if (likesForPost.length > 0) {
          await LikesModel.deleteMany({ postId: post._id });
        }
        const commentsForPost = await CommentModel.find({ postId: post._id });
        if (commentsForPost.length > 0) {
          await CommentModel.deleteMany({ postId: post._id });
        }
        const photo = post.photo;
        if (photo) {
          const fileName = photo.split("/").pop() || "";
          const imageDelete = await deleteImageMiddleware(fileName);
          if (!imageDelete) {
            res.status(500).send("Error deleting image");
            return;
          }
        }
      });
      await PostModel.deleteMany({ owner: userId });
    }
    next();
  } catch (error) {
    res.status(500).send(error);
  }
};

export const commentsPostMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const postId = req.body.postId;
    const post = await PostModel.findById(postId);
    if (!post) {
      res.status(404).send("Post not found");
      return;
    }
    next();
  } catch (error) {
    res.status(500).send(error);
  }
};

export const likesMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const value = req.body.value;
    const postId = req.body.postId;
    if (value !== 1 && value !== -1) {
      res.status(400).send("Invalid value");
      return;
    }
    const post = await PostModel.findById(postId);
    if (!post) {
      res.status(404).send("Post not found");
      return;
    }
    post.likes += value;
    await post.save();
    next();
  } catch (error) {
    res.status(500).send(error);
  }
};
