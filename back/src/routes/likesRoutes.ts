import express from "express";
import likesController from "../controllers/likesController";
import authController from "../controllers/authController";
import { likesMiddleware } from "../controllers/middlewares";
const likesRouter = express.Router();
/**
 * @swagger
 * tags:
 *  name: Likes
 *  description: Likes api
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Likes:
 *       type: object
 *       required:
 *         - owner
 *         - postId
 *       properties:
 *         owner:
 *           type: string
 *           description: ID of the user who liked the post
 *         postId:
 *           type: string
 *           description: ID of the post that was liked
 *         date:
 *           type: string
 *           format: date-time
 *           description: Date when the like was created (generated automatically)
 *       example:
 *         owner: "1324342"
 *         postId: "1234"
 *         date: "2025-02-26T17:13:28.504Z"
 */

likesRouter
/**
 * @swagger
 * /likes:
 *   post:
 *     summary: Add a like to a post
 *     tags:
 *       - Likes
 *     security:
 *       - bearerAuth: []
 *     description: Requires access token. Adds a like to a specific post by the authenticated user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postId:
 *                 type: string
 *                 example: "679b79213d4c2e12fcb96aa9"
 *               value:
 *                  type: number
 *                  example: 1
 *                  description: 1 for like, -1 for removing like
 *     responses:
 *       201:
 *         description: Like added successfully
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: No token provided
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
  .post(
    "/",
    authController.autMiddleware,
    likesMiddleware,
    likesController.create.bind(likesController)
  )
  /**
 * @swagger
 * /likes/{id}:
 *   delete:
 *     summary: Remove a like by ID
 *     tags:
 *       - Likes
 *     security:
 *       - bearerAuth: []
 *     description: Requires access token. Deletes a like by its ID. Only the owner of the like can delete it.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the like to delete
 *         example: "679b79213d4c2e12fcb96aa9"
 *     responses:
 *       204:
 *         description: Like deleted successfully
 *       401:
 *         description: No token provided
 *       403:
 *         description: Unauthorized, only the owner of the like can delete it
 *       404:
 *         description: Like not found
 *       500:
 *         description: Internal server error
 */
  .delete(
    "/:id",
    authController.autMiddleware,
    likesController.deleteItemById.bind(likesController)
  )
  /**
 * @swagger
 * /likes/getByUserId:
 *   get:
 *     summary: Get likes by user ID
 *     tags:
 *       - Likes
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve all likes made by the authenticated user. Requires access token.
 *     responses:
 *       200:
 *         description: List of likes made by the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Likes'
 *       401:
 *         description: No token provided
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
  .get(
    "/getByUserId",
    authController.autMiddleware,
    likesController.getByUserId.bind(likesController)
  )
  /**
 * @swagger
 * /likes/getByUserAndPost:
 *   post:
 *     summary: Check if a user has liked a specific post
 *     tags:
 *       - Likes
 *     security:
 *       - bearerAuth: []
 *     description: Requires access token. Checks if the authenticated user has liked a specific post.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postId:
 *                 type: string
 *                 description: ID of the post to check
 *                 example: "679b79213d4c2e12fcb96aa9"
 *     responses:
 *       200:
 *         description: Like status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 hasLiked:
 *                   type: boolean
 *                   description: Whether the user has liked the post
 *                   example: true
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: No token provided
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
  .post(
    "/getByUserAndPost",
    authController.autMiddleware,
    likesController.getByUserAndPost.bind(likesController)
  );

export default likesRouter;
