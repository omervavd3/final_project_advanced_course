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
});

afterAll(async () => {
  console.log("afterAll");
  await PostModel.deleteMany();
  await UserModel.deleteMany();
  await CommentModel.deleteMany();
  mongoose.connection.close();
});

const editComment = "Edit comment";

describe("Comments Tests", () => {
  test("Comments test get all", async () => {
    const response = await request(app).get("/comments");
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(0);
  });

  test("Comments test get all fail", async () => {
    const response = await request(app).get("/comments/123");
    expect(response.statusCode).toBe(500);
  });

  test("Comments test create", async () => {
    const response = await request(app)
      .post("/comments")
      .set({
        Authorization: `JWT ${testUser.accessToken}`,
      })
      .send({
        postId: testPost._id,
        comment: testComment.comment,
        owner: testUser._id,
        ownerName: testUser.userName,
      });
    testComment._id = response.body._id;
    testComment.owner = testUser._id;
    testComment.postId = testPost._id;
    expect(response.statusCode).toBe(201);
  });

  test("Comments test edit comment", async () => {
    const response = await request(app)
      .put(`/comments/${testComment._id}`)
      .set({
        Authorization: `JWT ${testUser.accessToken}`,
      })
      .send({
        comment: editComment,
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.comment).toBe(editComment);
  });

  test("Comments test edit comment without authorization", async () => {
    const response = await request(app)
      .put(`/comments/${testComment._id}`)
      .set({
        Authorization: `JWT ${testUser2.accessToken}`,
      })
      .send({
        comment: editComment,
      });
    expect(response.statusCode).not.toBe(200);
  });

  test("Comments test edit comment without token", async () => {
    const response = await request(app)
      .put(`/comments/${testComment._id}`)
      .set({})
      .send({
        postId: testPost._id,
        comment: editComment,
      });
    expect(response.statusCode).not.toBe(200);
  });

  test("Comments test create without all params", async () => {
    const response = await request(app)
      .post("/comments")
      .set({
        Authorization: `JWT ${testUser.accessToken}`,
      })
      .send({
        comment: "Test Comment",
      });
    expect(response.statusCode).not.toBe(200);
  });

  test("Comments test create without token", async () => {
    const response = await request(app).post("/comments").set({}).send({
      postId: testPost._id,
      comment: "Test Comment",
    });
    expect(response.statusCode).not.toBe(200);
  });

  test("Comments test get all", async () => {
    const response = await request(app).get("/comments");
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
  });

  test("Comments test get by id", async () => {
    const response = await request(app).get(`/comments/${testComment._id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.comment).toBe(editComment);
  });

  test("Comments test get by id fail", async () => {
    const response = await request(app).get(
      "/comments/679b7a76c6298d8d9a33923b"
    );
    expect(response.statusCode).not.toBe(200);
  });

  test("Comments get by filter", async () => {
    const response = await request(app).get(`/comments?owner=${testUser._id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);

    const response2 = await request(app).get(`/comments?owner=123`);
    expect(response2.statusCode).toBe(200);
    expect(response2.body.length).toBe(0);
  });

  test("Comments get by post id", async () => {
    const response = await request(app)
      .get(`/comments/getByPostId/${testPost._id}/1/10`)
      .set({
        Authorization: `JWT ${testUser.accessToken}`,
      });
    expect(response.statusCode).toBe(200);
  });

  test("Comments test delete without authorization", async () => {
    const response = await request(app)
      .delete(`/comments/${testComment._id}`)
      .set({
        Authorization: `JWT ${testUser2.accessToken}`,
      });
    expect(response.statusCode).not.toBe(204);
  });

  test("Comments test delete", async () => {
    const response = await request(app)
      .delete(`/comments/${testComment._id}`)
      .set({
        Authorization: `JWT ${testUser.accessToken}`,
      });
    expect(response.statusCode).toBe(204);
  });

  test("Comments test delete deleted comment", async () => {
    const response = await request(app)
      .delete(`/comments/${testComment._id}`)
      .set({
        Authorization: `JWT ${testUser.accessToken}`,
      });
    expect(response.statusCode).toBe(404);
  });

  test("Comments test delete without token", async () => {
    const response = await request(app)
      .delete(`/comments/${testComment._id}`)
      .set({});
    expect(response.statusCode).not.toBe(204);
  });

  test("Comments test delete with wrong token", async () => {
    const response = await request(app)
      .delete(`/comments/${testComment._id}`)
      .set({
        Authorization: `JWT ${testUser.accessToken}1`,
      });
    expect(response.statusCode).toBe(403);
  });
});
