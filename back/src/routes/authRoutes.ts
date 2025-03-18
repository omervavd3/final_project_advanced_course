import express from "express";
const authRouter = express.Router();
import authController from "../controllers/authController";
import {
  authDeleteMiddleware,
  authUpdateMiddleWare,
  authUpdatePasswordMiddleware,
} from "../controllers/middlewares";

/**
 * @swagger
 * tags:
 *  name: Auth
 *  description: Auth api
 */

/**
 * @swagger
 * components:
 *  securitySchemes:
 *    bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      required:
 *        - email
 *        - password
 *        - userName
 *      properties:
 *        email:
 *          type: string
 *          description: Email of the user
 *        password:
 *          type: string
 *          description: Password of the user
 *        userName:
 *          type: string
 *          description: Name of the user
 *      example:
 *        email: 'example@mail.com'
 *        password: '1234'
 *        userName: 'name'
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    Tokens:
 *      type: object
 *      required:
 *        - accessToken
 *        - refreshToken
 *      properties:
 *        accessToken:
 *          type: string
 *          description: JWT Access token
 *        refreshToken:
 *          type: string
 *          description: JWT Refresh token
 *      example:
 *        accessToken: 'aefefEWF'
 *        refreshToken: 'aefefEWF'
 */

authRouter
  /**
   * @swagger
   * /auth/register:
   *  post:
   *    summary: Register a new user
   *    tags:
   *      - Auth
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/User'
   *    responses:
   *      201:
   *        description: User registered successfully
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#components/schemas/User'
   *      400:
   *         description: User already exists
   *      404:
   *         description: No email or password provided
   *      500:
   *        description: Internal server error
   */
  .post("/register", authController.register)
  .post("/google", authController.googleSignIn)
  /**
   * @swagger
   * /auth/login:
   *   post:
   *     summary: Login a user
   *     tags:
   *       - Auth
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 example: 'example@mail.com'
   *               password:
   *                 type: string
   *                 example: '1234'
   *     responses:
   *       200:
   *         description: User logged in successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Tokens'
   *       404:
   *         description: No email or password provided
   *       400:
   *         description: User does not exist
   *       402:
   *         description: Invalid password
   *       500:
   *         description: Internal server error
   */
  .post("/login", authController.login)
  /**
   * @swagger
   * /auth/updatePassword:
   *   put:
   *     summary: Update user password, only if old password is correct and if user is logged in
   *     tags:
   *       - Auth
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               oldPassword:
   *                 type: string
   *                 example: '1234'
   *               newPassword:
   *                 type: string
   *                 example: '5678'
   *               email:
   *                 type: string
   *                 example: 'example@mail.com'
   *     responses:
   *       200:
   *         description: User password updated successfully
   *       402:
   *         description: Invalid password
   *       404:
   *         description: User not found
   *       500:
   *         description: Internal server error
   */
  .put(
    "/updatePassword",
    authController.autMiddleware,
    authUpdatePasswordMiddleware,
    authController.updateUser
  )
  /**
   * @swagger
   * /auth/logout:
   *  post:
   *    summary: Logout a user
   *    tags:
   *      - Auth
   *    description: Needs to provide refresh token
   *    security:
   *      - bearerAuth: []
   *    responses:
   *      200:
   *        description: User logged out successfully
   *      401:
   *        description: Unauthorized
   *      500:
   *        description: Internal server error
   */
  .post("/logout", authController.logout)
  /**
   * @swagger
   * /auth/refresh:
   *  post:
   *    summary: Returns new access token by submitting refresh token
   *    tags:
   *      - Auth
   *    description: Needs to provide refresh token
   *    security:
   *      - bearerAuth: []
   *    responses:
   *      200:
   *        description: New access token generated
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Tokens'
   *      401:
   *        description: Unauthorized
   *      403:
   *        description: Invalid refresh token
   *      500:
   *        description: Internal server error
   */
  .put(
    "/",
    authController.autMiddleware,
    authUpdateMiddleWare,
    authController.updateUser
  )
  .post("/refresh", authController.refreshToken)
  .get("/getUserInfo", authController.autMiddleware, authController.getUserInfo)
  .get(
    "/getProfileImageUrlAndName",
    authController.autMiddleware,
    authController.getProfileImageUrlAndName
  )
  .delete(
    "/deleteUser",
    authController.autMiddleware,
    authDeleteMiddleware,
    authController.deleteUser
  );

export default authRouter;
