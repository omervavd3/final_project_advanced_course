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
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - owner
 *         - ownerName
 *         - ownerPhoto
 *         - photo
 *       properties:
 *         title:
 *           type: string
 *           description: Title of the post
 *         content:
 *           type: string
 *           description: Content of the post
 *         owner:
 *           type: string
 *           description: ID of the owner of the post
 *         ownerName:
 *           type: string
 *           description: Name of the owner of the post
 *         ownerPhoto:
 *           type: string
 *           description: URL of the owner's photo
 *         photo:
 *           type: string
 *           description: URL of the post's photo
 *         likes:
 *           type: number
 *           description: Number of likes on the post
 *           default: 0
 *         date:
 *           type: string
 *           format: date-time
 *           description: Date when the post was created (generated automatically)
 *       example:
 *         title: Post Title
 *         content: Post Content
 *         owner: hsedrtyjyt45t
 *         ownerName: John Doe
 *         ownerPhoto: https://example.com/photo.jpg
 *         photo: https://example.com/post-photo.jpg
 *         likes: 10
 *         date: 2025-02-26T17:13:28.504Z
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
 *     description: Requires access token. Creates a new post with the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the post
 *                 example: "Post Title"
 *               content:
 *                 type: string
 *                 description: Content of the post
 *                 example: "Post Content"
 *               ownerName:
 *                 type: string
 *                 description: Name of the owner of the post
 *                 example: "John Doe"
 *               ownerPhoto:
 *                 type: string
 *                 description: URL of the owner's photo
 *                 example: "https://example.com/photo.jpg"
 *               photo:
 *                 type: string
 *                 description: URL of the post's photo
 *                 example: "https://example.com/post-photo.jpg"
 *     responses:
 *       201:
 *         description: New post created
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: No token provided
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
 *     summary: Update a post by ID, only the owner can update it
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     description: Requires access token. Updates the details of a post by its ID. Only the owner of the post can perform this action.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to update
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
 *                 description: Updated title of the post
 *                 example: "Updated Post Title"
 *               content:
 *                 type: string
 *                 description: Updated content of the post
 *                 example: "Updated Post Content"
 *               photo:
 *                 type: string
 *                 description: Updated URL of the post's photo
 *                 example: "https://example.com/updated-post-photo.jpg"
 *     responses:
 *       200:
 *         description: Post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       403:
 *         description: Unauthorized, only the owner of the post can edit
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
    /**
 * @swagger
 * /posts/getByUserId:
 *   post:
 *     summary: Get posts by user ID
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     description: Requires access token. Retrieves all posts created by the authenticated user.
 *     responses:
 *       200:
 *         description: List of posts created by the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       401:
 *         description: No token provided
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
    .post("/getByUserId", authController.autMiddleware, PostController.getByUserId.bind(PostController))
    /**
 * @swagger
 * /posts/getAllPagination/{page}/{limit}:
 *   get:
 *     summary: Get all posts with pagination
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     description: Requires access token. Retrieves a paginated list of posts.
 *     parameters:
 *       - in: path
 *         name: page
 *         required: true
 *         schema:
 *           type: integer
 *         description: The page number to retrieve
 *         example: 1
 *       - in: path
 *         name: limit
 *         required: true
 *         schema:
 *           type: integer
 *         description: The number of posts per page
 *         example: 10
 *     responses:
 *       200:
 *         description: Paginated list of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 posts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Post'
 *                 totalPosts:
 *                   type: integer
 *                   description: Total number of posts
 *                   example: 100
 *                 totalPages:
 *                   type: integer
 *                   description: Total number of pages
 *                   example: 10
 *                 currentPage:
 *                   type: integer
 *                   description: Current page number
 *                   example: 1
 *       401:
 *         description: No token provided
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
    .get("/getAllPagination/:page/:limit", authController.autMiddleware,PostController.getAllPagination.bind(PostController));

export default postRouter;