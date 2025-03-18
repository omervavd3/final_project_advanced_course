import request from "supertest";
import initApp from "../server";
import { Express } from "express";
import mongoose from "mongoose";

var app: Express;

beforeAll(async () => {
  app = await initApp();
});

afterAll(async () => {
  mongoose.connection.close();
});

describe("File Tests", () => {
  let uploadedFileUrl: string;
  test("upload file", async () => {
    const filePath = `${__dirname}/icons8-avatar-96.png`;

    try {
      const response = await request(app)
        .post("/file?file=123.jpeg")
        .attach("file", filePath);
      expect(response.statusCode).toEqual(200);
      let url = response.body.url;
      url = url.replace(/^.*\/\/[^/]+/, "");
      uploadedFileUrl = response.body.url;
      const res = await request(app).get(url);
      expect(res.statusCode).toEqual(200);
    } catch (err) {
      console.log(err);
      expect(1).toEqual(2);
    }
  });

  test("upload file fail", async () => {
    const filePath = `${__dirname}/icons8-avatar-96.png`;
    const response = await request(app)
      .post("/file?file=123.jpeg")
    expect(response.statusCode).not.toEqual(200);
  });

  test("delete file", async () => {
    const fileName = uploadedFileUrl.split("/").pop();
    console.log("File name to delete: ", fileName);

    const response = await request(app).delete(`/file/${fileName}`);
    expect(response.statusCode).toEqual(200);

    await new Promise((resolve) => setTimeout(resolve, 500));

    const res = await request(app).get(`/file/${fileName}`);
    expect(res.statusCode).toEqual(404);
  });

  test("delete file fail", async () => {
    const fileName = uploadedFileUrl.split("/").pop();
    console.log("File name to delete: ", fileName);

    const response = await request(app).delete(`/file/${fileName}`);
    expect(response.statusCode).not.toEqual(200);
  });
});
