import express from "express";
const commentRouter = express.Router();
import commentController from "../controllers/commentController";
import authController from "../controllers/authController";
import {
  commentDeleteMiddleware,
  commentEditMiddleware,
  commentsPostMiddleware,
} from "../controllers/middlewares";
/**
 * @swagger
 * tags:
 *  name: Comment
 *  description: Comment api
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - comment
 *         - owner
 *         - postId
 *       properties:
 *         comment:
 *           type: string
 *           description: Comment content
 *         owner:
 *           type: string
 *           description: ID of the owner of the comment
 *         postId:
 *           type: string
 *           description: Post id of the comment
 *         date:
 *           type: Date
 *           description: Date of the comment (generated automatically)
 *       example:
 *         comment: Post Comment
 *         owner: "1324342"
 *         postId: "1234"
 *         date: "2025-02-26T17:13:28.504Z"
 */

commentRouter
  /**
   * @swagger
   * /comments:
   *   get:
   *     summary: Get all comments, can filter by owner
   *     tags:
   *       - Comment
   *     parameters:
   *       - in: query
   *         name: owner
   *         description: Owner of the comment
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: The list of the comments
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Comment'
   *       500:
   *         description: Internal server error
   */
  .get("/", commentController.getAll.bind(commentController))
  /**
   * @swagger
   * /comments/{id}:
   *   get:
   *     summary: Get comment by id
   *     tags:
   *       - Comment
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: Comment by comment id
   *         schema:
   *           type: string
   *           example: 679b79213d4c2e12fcb96aa9
   *     responses:
   *       200:
   *         description: The comment by id
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Comment'
   *       404:
   *        description: Not found
   *       500:
   *         description: Internal server error
   */
  .get("/:id", commentController.getById.bind(commentController))
  /**
   * @swagger
   * /comments:
   *   post:
   *     summary: Create a new comment
   *     tags:
   *       - Comment
   *     security:
   *       - bearerAuth: []
   *     description: Requires access token
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               comment:
   *                 type: string
   *                 example: "Comment content"
   *               postId:
   *                 type: string
   *                 example: "679b79213d4c2e12fcb96aa9"
   *     responses:
   *       201:
   *         description: New comment created
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Comment'
   *       404:
   *         description: Post not found
   *       500:
   *         description: Internal server error
   */
  .post(
    "/",
    authController.autMiddleware,
    commentsPostMiddleware,
    commentController.create.bind(commentController)
  )
  /**
   * @swagger
   * /comments/{id}:
   *   put:
   *     summary: Edit a comment by id, only owner of the comment can edit
   *     tags:
   *       - Comment
   *     security:
   *       - bearerAuth: []
   *     description: Requires access token
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Comment id
   *         example: 679b79213d4c2e12fcb96aa9
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               comment:
   *                 type: string
   *                 example: "Comment content updated"
   *     responses:
   *       200:
   *         description: Comment edited
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Comment'
   *       403:
   *         description: Unauthorized, only owner of the comment can edit
   *       404:
   *         description: Comment not found
   *       500:
   *         description: Internal server error
   */
  .put(
    "/:id",
    authController.autMiddleware,
    commentEditMiddleware,
    commentController.updateItemById.bind(commentController)
  )
  /**
   * @swagger
   * /comments/{id}:
   *   delete:
   *     summary: Delete a comment by id
   *     tags:
   *       - Comment
   *     security:
   *       - bearerAuth: []
   *     description: Requires access token
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Comment id
   *         example: 679b79213d4c2e12fcb96aa9
   *     responses:
   *       204:
   *         description: Comment deleted
   *       403:
   *         description: Unauthorized, only owner of the post or the comment can delete
   *       404:
   *         description: Comment not found
   *       500:
   *         description: Internal server error
   */
  .delete(
    "/:id",
    authController.autMiddleware,
    commentDeleteMiddleware,
    commentController.deleteItemById.bind(commentController)
  )

  .get(
    "/getByPostId/:postId/:page/:limit",
    authController.autMiddleware,
    commentController.getByPostId.bind(commentController)
  )
  .get(
    "/getByUserId",
    authController.autMiddleware,
    commentController.getByUserId.bind(commentController)
  );

export default commentRouter;
