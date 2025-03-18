import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import PostModel from "../models/postModel";
import UserModel from "../models/userModel";
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
  email: "test@example2.com",
  password: "1234",
  userName: "name test 3",
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

const testPost2: Post = {
  title: "Test Title 2",
  content: "Test Content 2",
  photo: "https://www.google.com",
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
    profileImageUrl: testUser.profileImageUrl,
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
    profileImageUrl: testUser2.profileImageUrl,
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
    const response = await request(app)
      .get("/posts/123")
      .set({
        Authorization: "JWT " + testUser.accessToken,
      });
    expect(response.statusCode).toBe(500);
  });

  test("Test Create Post", async () => {
    const response = await request(app)
      .post("/posts")
      .set({
        Authorization: "JWT " + testUser.accessToken,
      })
      .send({
        title: testPost.title,
        content: testPost.content,
        photo: testPost.photo,
        ownerName: testUser.userName,
        ownerPhoto: testUser.profileImageUrl,
      });
    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe(testPost.title);
    expect(response.body.content).toBe(testPost.content);
    expect(response.body.owner).toBe(testUser._id);
    postId = response.body._id;
  });

  test("Test edit post without params", async () => {
    const response = await request(app)
      .put("/posts/" + postId)
      .set({
        Authorization: "JWT " + testUser.accessToken,
      })
      .send({});
    expect(response.statusCode).toBe(400);
  });

  test("Test edit post with photo blob", async () => {
    const response = await request(app)
      .put("/posts/" + postId)
      .set({
        Authorization: "JWT " + testUser.accessToken,
      })
      .send({
        title: testPost.title,
        content: testPost.content,
        photo: "blob:https://www.google.com",
      });
    expect(response.statusCode).toBe(200);
  });

  test("Test edit post with wrong postId", async () => {
    const response = await request(app)
      .put("/posts/" + postId + "1")
      .set({
        Authorization: "JWT " + testUser.accessToken,
      })
      .send({
        title: testPost.title,
        content: testPost.content,
        photo: testPost.photo,
      });
    expect(response.statusCode).not.toBe(200);
  });

  test("Test edit post", async () => {
    const response = await request(app)
      .put("/posts/" + postId)
      .set({
        Authorization: "JWT " + testUser.accessToken,
      })
      .send({
        title: testPost2.title,
        content: testPost.content,
        photo: testPost.photo,
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(testPost2.title);
    expect(response.body.content).toBe(testPost.content);
    expect(response.body.owner).toBe(testUser._id);
  });

  test("Test edit post without authorization", async () => {
    const response = await request(app)
      .put("/posts/" + postId)
      .set({
        Authorization: "JWT " + testUser2.accessToken,
      })
      .send({
        title: testPost2.title,
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
        title: testPost.title,
      });
    expect(response.statusCode).toBe(500);
  });

  test("Test Create Post without token", async () => {
    const response = await request(app).post("/posts").set({}).send({
      title: testPost.title,
      content: testPost.content,
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
        title: testPost.title,
        content: testPost.content,
      });
    expect(response.statusCode).toBe(403);
  });

  test("Test get all pagination", async () => {
    const response = await request(app)
      .get("/posts/getAllPagination/1/10")
      .set({
        Authorization: "JWT " + testUser.accessToken,
      });
    expect(response.statusCode).toBe(200);
  });

  test("Test get post by owner", async () => {
    const response = await request(app).get(`/posts?owner=${testUser._id}`);
    expect(response.statusCode).toBe(200);
  });

  test("Posts test get all fail (no matching owner)", async () => {
    const response = await request(app).get("/posts/?owner=123");
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(0);
  });

  test("Test get post by id", async () => {
    const response = await request(app)
      .get("/posts/" + postId)
      .set({
        Authorization: "JWT " + testUser.accessToken,
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(testPost2.title);
    expect(response.body.content).toBe(testPost.content);
    expect(response.body.owner).toBe(testUser._id);
  });

  test("Test get all by user id", async () => {
    const response = await request(app)
      .post("/posts/getByUserId")
      .set({
        Authorization: "JWT " + testUser.accessToken,
      });
    expect(response.statusCode).toBe(200);
  })

  test("Test get post by id fail (no matchind id)", async () => {
    const response = await request(app).get(
      "/posts/" + "679b79213d4c2e12fcb96aa9"
    );
    expect(response.statusCode).not.toBe(200);
  });

  test("Test Delete Post Whitout Authorization", async () => {
    const response = await request(app)
      .delete("/posts/" + postId)
      .set({
        Authorization: "JWT " + testUser2.accessToken,
      })
    expect(response.statusCode).not.toBe(204);
  });


  test("Test Delete Post", async () => {
    const response = await request(app)
      .delete("/posts/" + postId)
      .set({
        Authorization: "JWT " + testUser.accessToken,
      })
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
    const response = await request(app)
      .get("/posts/" + postId)
      .set({
        Authorization: "JWT " + testUser.accessToken,
      });
    expect(response.statusCode).toBe(404);
  });

  test("Posts test get all after delete", async () => {
    const response = await request(app).get("/posts");
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(0);
  });
});
