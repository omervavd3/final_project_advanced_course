import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import UserModel from "../models/userModel";
import { Express } from "express";
import PostModel from "../models/postModel";
import LikesModel from "../models/likesModel";

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

type Like = {
  owner?: string;
  postId?: string;
  date?: Date;
  _id?: string;
};

const testLike: Like = {};

beforeAll(async () => {
  console.log("beforeAll");
  app = await initApp();
  await PostModel.deleteMany();
  await UserModel.deleteMany();
  await LikesModel.deleteMany();
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
});

afterAll(async () => {
  console.log("afterAll");
  await PostModel.deleteMany();
  await UserModel.deleteMany();
  await LikesModel.deleteMany();
  mongoose.connection.close();
});

describe("User Tests", () => {
  test("Likes create like", async () => {
    const res = await request(app)
      .post("/likes")
      .set({
        authorization: `JWT ${testUser.accessToken}`,
      })
      .send({
        postId: testPost._id,
        value: 1,
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.owner).toBe(testUser._id);
    testLike._id = res.body._id;
    testLike.owner = res.body.owner;
    testLike.postId = res.body.postId;
    testLike.date = res.body.date;
  });

  test("Likes get by user id", async () => {
    const res = await request(app)
      .get("/likes/getByUserId")
      .set({
        authorization: `JWT ${testUser.accessToken}`,
      });
    expect(res.statusCode).toBe(200);
    expect(res.body[0].owner).toBe(testUser._id);
  });

  test("Likes get by user and post", async () => {
    const res = await request(app)
      .post("/likes/getByUserAndPost")
      .set({
        authorization: `JWT ${testUser.accessToken}`,
      })
      .send({
        postId: testPost._id,
      });
    expect(res.statusCode).toBe(200);
    expect(res.body[0].owner).toBe(testUser._id);
  });

  test("Likes remove like after create", async () => {
    const res = await request(app)
      .post("/likes")
      .set({
        authorization: `JWT ${testUser.accessToken}`,
      })
      .send({
        postId: testPost._id,
        value: -1,
      });
    expect(res.statusCode).toBe(200);
  })

  test("Likes create fail", async () => {
    const res = await request(app)
      .post("/likes")
      .set({
        authorization: `JWT ${testUser.accessToken}`,
      })
      .send({
        postId: testPost._id,
        value: 10,
      });
    expect(res.statusCode).not.toBe(200);
  })
});
