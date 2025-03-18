import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import PostModel from "../models/postModel";
import UserModel from "../models/userModel";
import CommentModel from "../models/commentsModel";
import { Express } from "express";

var app: Express;

type User = {
  email: string;
  password: string;
  userName: string;
  profileImageUrl: string;
  _id?: string;
  refreshToken?: string;
  accessToken?: string;
};

const testUser: User = {
  email: "test@example.com",
  password: "1234",
  userName: "name test",
  profileImageUrl: "https://www.google.com",
};

const testUser2: User = {
  email: "example2@email.com",
  password: "6789",
  userName: "j.v",
  profileImageUrl: "https://www.google.com",
};

type Post = {
  title: string;
  content: string;
  owner?: string;
  ownerName?: string;
  ownerPhoto?: string;
  photo: string;
  likes?: number;
  date?: Date;
  _id?: string;
};

const testPost: Post = {
  title: "Test Title",
  content: "Test Content",
  photo: "https://www.google.com",
};

type Comment = {
  owner?: string;
  postId?: string;
  comment: string;
  ownerName?: string;
  date?: Date;
  _id?: string;
};

const testComment: Comment = {
  comment: "Test Comment",
};

beforeAll(async () => {
  console.log("beforeAll");
  app = await initApp();
  await PostModel.deleteMany();
  await UserModel.deleteMany();
  await CommentModel.deleteMany();
  const res = await request(app).post("/auth/register").send({
    email: testUser.email,
    password: testUser.password,
    userName: testUser.userName,
    profileImageUrl: testUser.profileImageUrl,
  });
  console.log("res: " + res.statusCode);
  testUser._id = res.body._id;
  testPost.owner = res.body._id;
  const res2 = await request(app).post("/auth/login").send({
    email: testUser.email,
    password: testUser.password,
  });
  testUser.refreshToken = res2.body.refreshToken;
  testUser.accessToken = res2.body.accessToken;
  expect(testUser.refreshToken).toBeDefined();
  expect(testUser.accessToken).toBeDefined();

  const res3 = await request(app)
    .post("/posts")
    .set({
      Authorization: `JWT ${testUser.accessToken}`,
    })
    .send({
      owner: testPost.owner,
      ownerName: testUser.userName,
      ownerPhoto: testUser.profileImageUrl,
      photo: testPost.photo,
      title: testPost.title,
      content: testPost.content,
    });
  expect(res3.statusCode).toBe(201);
  testPost._id = res3.body._id;

  const res4 = await request(app).post("/auth/register").send({
    email: testUser2.email,
    password: testUser2.password,
    userName: testUser2.userName,
    profileImageUrl: testUser2.profileImageUrl,
  });
  console.log("res4: " + res4.statusCode);
  testUser2._id = res4.body._id;
  const res5 = await request(app).post("/auth/login").send({
    email: testUser2.email,
    password: testUser2.password,
  });
  testUser2.refreshToken = res5.body.refreshToken;
  testUser2.accessToken = res5.body.accessToken;
  expect(testUser2.refreshToken).toBeDefined();
  expect(testUser2.accessToken).toBeDefined();

  const re6 = await request(app)
    .post("/comments")
    .set({
      Authorization: `JWT ${testUser.accessToken}`,
    })
    .send({
      owner: testUser._id,
      postId: testPost._id,
      comment: testComment.comment,
      ownerName: testUser.userName,
    });
  testComment._id = re6.body._id;
  expect(re6.statusCode).toBe(201);

  const res7 = await request(app)
    .post("/likes")
    .set({
      Authorization: `JWT ${testUser.accessToken}`,
    })
    .send({
      owner: testUser._id,
      postId: testPost._id,
      value: 1,
    });
  expect(res7.statusCode).toBe(201);
});

afterAll(async () => {
  console.log("afterAll");
  await PostModel.deleteMany();
  await UserModel.deleteMany();
  await CommentModel.deleteMany();
  mongoose.connection.close();
});

describe("Post Middlewares Tests", () => {
  test("Test delete post middleware", async () => {
    const res = await request(app)
      .delete("/posts/" + testPost._id)
      .set({
        Authorization: `JWT ${testUser.accessToken}`,
      });
    expect(res.statusCode).toBe(204);
  });
});
