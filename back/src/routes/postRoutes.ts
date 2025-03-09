import express from "express";
const postRouter = express.Router();
import PostController from "../controllers/postController";
import authController from "../controllers/authController";
import { postDeleteMiddleware, postMiddleware } from "../controllers/middlewares";

/**
 * @swagger
 * tags:
 *  name: Posts
 *  description: Post api
 */

/**
 * @swagger
 * components:
 *  schemas:
 *      Post:
 *          type: object
 *          required:
 *              - title
 *              - content
 *              - owner
 *          properties:
 *              title:
 *                  type: string
 *                  description: Title of the post
 *              content:
 *                  type: string
 *                  description: Content of the post
 *              owner:
 *                  type: string
 *                  description: ID of the owner of the post
 *              date:
 *                 type: Date
 *                 description: Date of the post (generated automatically)
 *          example:
 *              title: Post Title
 *              content: Post Content
 *              owner: hsedrtyjyt45t
 *              date: 2025-02-26T17:13:28.504Z
 */

postRouter
/**
 * @swagger
 * /posts:
 *  get:
 *    summary: Get all posts
 *    tags: 
 *      - Posts
 *    parameters:
 *      - in: query
 *        name: owner
 *    responses:
 *      200:
 *        description: The list of the posts
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Post'
 *      500:
 *        description: Some server error
 */
    .get("/", PostController.getAll.bind(PostController))
/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new post
 *     tags:
 *       - Posts
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
 *               title:
 *                 type: string
 *                 example: "Post Title"
 *               content:
 *                 type: string
 *                 example: "Post Content"
 *     responses:
 *       201:
 *         description: New post created
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       500:
 *         description: Some server error
 */
    .post("/", authController.autMiddleware ,PostController.create.bind(PostController))
/**
 * @swagger
 * /posts/{id}:
 *  get:
 *     summary: Get a post filtered by post id
 *     tags: 
 *      - Posts
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *          description: The post id
 *          example: 679b79213d4c2e12fcb96aa9
 *     responses:
 *         200:
 *            description: A single post
 *            content:
 *               application/json:
 *                 schema:
 *                   $ref: '#/components/schemas/Post'
 *         500:
 *           description: Some server error
 */
    .get("/:id", authController.autMiddleware,PostController.getById.bind(PostController))
/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Update a post by id, only owner can update it
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     description: Requires access token
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The post id
 *         example: 679b79213d4c2e12fcb96aa9
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Post Title Updated"
 *               content:
 *                 type: string
 *                 example: "Post Content Updated"
 *     responses:
 *       200:
 *         description: Post updated
 *       403:
 *         description: Unauthorized, only owner of the post can edit
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */
    .put("/:id", authController.autMiddleware, postMiddleware ,PostController.updateItemById.bind(PostController))
/**
 * @swagger
 * /posts/{id}:
 *  delete:
 *    summary: Delete a post by id
 *    tags:
 *      - Posts
 *    security:
 *      - bearerAuth: []
 *    description: Requires access token
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: The post id
 *        example: 679b79213d4c2e12fcb96aa9
 *    responses:
 *      204:
 *        description: Post deleted
 *      404:
 *        description: Post not found
 *      500:
 *        description: Some server error
 */
    .delete("/:id", authController.autMiddleware, postMiddleware, postDeleteMiddleware ,PostController.deleteItemById.bind(PostController))
    .post("/getByUserId", authController.autMiddleware, PostController.getByUserId.bind(PostController))
    .get("/getAllPagination/:page/:limit", authController.autMiddleware,PostController.getAllPagination.bind(PostController));

export default postRouter;