import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import PostModel from "../models/postModel";
import UserModel from "../models/userModel";
import e, { Express } from "express";
import * as testJSON from "./testPost.json";

var app: Express;

type User = {
  email: string;
  password: string;
  userName: string;
  _id?: string;
  refreshToken?: string;
  accessToken?: string;
};

const testUser: User = {
  email: "example@email.com",
  password: "1234",
  userName: "name test",
};

const testUser2: User = {
  email: "example2@email.com",
  password: "6789",
  userName: "test name",
};

beforeAll(async () => {
  console.log("beforeAll");
  app = await initApp();
  await PostModel.deleteMany();
  await UserModel.deleteMany();
  const res = await request(app).post("/auth/register").send({
    userName: testUser.userName,
    email: testUser.email,
    password: testUser.password,
  });
  testUser._id = res.body._id;
  const res2 = await request(app).post("/auth/login").send({
    email: testUser.email,
    password: testUser.password,
  });
  testUser.refreshToken = res2.body.refreshToken;
  testUser.accessToken = res2.body.accessToken;
  expect(testUser.refreshToken).toBeDefined();
  expect(testUser.accessToken).toBeDefined();

  const res3 = await request(app).post("/auth/register").send({
    userName: testUser2.userName,
    email: testUser2.email,
    password: testUser2.password,
  });
  testUser2._id = res3.body._id;
  expect(testUser2._id).toBeDefined();
  const res4 = await request(app).post("/auth/login").send({
    email: testUser2.email,
    password: testUser2.password,
  });
  testUser2.refreshToken = res4.body.refreshToken;
  testUser2.accessToken = res4.body.accessToken;
  expect(testUser2.refreshToken).toBeDefined();
  expect(testUser2.accessToken).toBeDefined();
});

afterAll(async () => {
  console.log("afterAll");
  await PostModel.deleteMany();
  await UserModel.deleteMany();
  mongoose.connection.close();
});

let postId = "";
describe("Posts Tests", () => {
  test("Posts test get all", async () => {
    const response = await request(app).get("/posts");
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(0);
  });

  test("Posts test get all fail", async () => {
    const response = await request(app).get("/posts/123");
    expect(response.statusCode).toBe(500);
  });

  test("Test Create Post", async () => {
    const response = await request(app)
      .post("/posts")
      .set({
        Authorization: "JWT " + testUser.accessToken,
      })
      .send({
        title: testJSON[0].title,
        content: testJSON[0].content,
      });
    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe(testJSON[0].title);
    expect(response.body.content).toBe(testJSON[0].content);
    expect(response.body.owner).toBe(testUser._id);
    postId = response.body._id;
  });

  test("Test edit post", async () => {
    const response = await request(app)
      .put("/posts/" + postId)
      .set({
        Authorization: "JWT " + testUser.accessToken,
      })
      .send({
        title: testJSON[1].title,
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(testJSON[1].title);
    expect(response.body.content).toBe(testJSON[0].content);
    expect(response.body.owner).toBe(testUser._id);
  });

  test("Test edit post without authorization", async () => {
    const response = await request(app)
      .put("/posts/" + postId)
      .set({
        Authorization: "JWT " + testUser2.accessToken,
      })
      .send({
        title: testJSON[1].title,
      });
    expect(response.statusCode).not.toBe(200);
  });

  test("Test Create Post without all params", async () => {
    const response = await request(app)
      .post("/posts")
      .set({
        Authorization: "JWT " + testUser.accessToken,
      })
      .send({
        title: testJSON[0].title,
      });
    expect(response.statusCode).toBe(500);
  });

  test("Test Create Post without token", async () => {
    const response = await request(app).post("/posts").set({}).send({
      title: testJSON[0].title,
      content: testJSON[0].content,
    });
    expect(response.statusCode).toBe(401);
  });

  test("Test create post with wrong token", async () => {
    const response = await request(app)
      .post("/posts")
      .set({
        Authorization: "JWT " + testUser.accessToken + "1",
      })
      .send({
        title: testJSON[0].title,
        content: testJSON[0].content,
      });
    expect(response.statusCode).toBe(403);
  });

  test("Test get post by owner", async () => {
    const response = await request(app).get(`/posts?owner=${testUser._id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].title).toBe(testJSON[1].title);
    expect(response.body[0].content).toBe(testJSON[0].content);
    expect(response.body[0].owner).toBe(testUser._id);
  });

  test("Posts test get all fail (no matching owner)", async () => {
    const response = await request(app).get("/posts/?owner=123");
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(0);
  });

  test("Test get post by id", async () => {
    const response = await request(app).get("/posts/" + postId);
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(testJSON[1].title);
    expect(response.body.content).toBe(testJSON[0].content);
    expect(response.body.owner).toBe(testUser._id);
  });

  test("Test get post by id fail (no matchind id)", async () => {
    const response = await request(app).get("/posts/" + "679b79213d4c2e12fcb96aa9");
    expect(response.statusCode).not.toBe(200);
  });

  test("Test Delete Post", async () => {
    const response = await request(app)
      .delete("/posts/" + postId)
      .set({
        Authorization: "JWT " + testUser.accessToken,
      });
    expect(response.statusCode).toBe(204);

    const response2 = await request(app)
      .delete("/posts/" + postId)
      .set({
        Authorization: "JWT " + testUser.accessToken,
      });
    expect(response2.statusCode).toBe(404);
  });

  test("Test Delete Post without token", async () => {
    const response = await request(app)
      .delete("/posts/" + postId)
      .set({});
    expect(response.statusCode).toBe(401);
  });

  test("Test Delete Post without valid token", async () => {
    const response = await request(app)
      .delete("/posts/" + postId + "1")
      .set({
        Authorization: "JWT " + testUser.accessToken + 1,
      });
    expect(response.statusCode).not.toBe(200);
  });

  test("Test get post by id fail (no data)", async () => {
    const response = await request(app).get("/posts/" + postId);
    expect(response.statusCode).toBe(404);
  });

  test("Posts test get all after delete", async () => {
    const response = await request(app).get("/posts");
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(0);
  });
});
