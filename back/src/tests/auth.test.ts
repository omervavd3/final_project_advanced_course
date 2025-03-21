import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import UserModel from "../models/userModel";
import { Express } from "express";
import { profile } from "console";

var app: Express;

beforeAll(async () => {
  console.log("beforeAll");
  app = await initApp();
  await UserModel.deleteOne({ email: testUser.email });
  await UserModel.deleteOne({ email: testUser2.email });
  await UserModel.deleteOne({ email: "test" });
});

afterAll(async () => {
  console.log("afterAll");
  await UserModel.deleteOne({ email: testUser.email });
  await UserModel.deleteOne({ email: testUser2.email });
  await UserModel.deleteOne({ email: "test" });
  mongoose.connection.close();
});

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

const userForRefresh: User = {
  email: "testRefresh@example.com",
  password: "4321",
  userName: "name test 2",
  profileImageUrl: "https://www.google.com",
  refreshToken: "123124534586756453",
  accessToken: "123124534586756453",
};

describe("User Tests", () => {
  test("Auth test register", async () => {
    const response = await request(app).post("/auth/register").send({
      email: testUser.email,
      password: testUser.password,
      userName: testUser.userName,
      profileImageUrl: testUser.profileImageUrl,
    });
    expect(response.statusCode).toBe(201);
    expect(response.body.password).not.toBe(testUser.password);
  });

  test("Auth test register with the same email again", async () => {
    const response = await request(app).post("/auth/register").send({
      email: testUser.email,
      password: testUser.password,
      userName: testUser.userName,
      profileImageUrl: testUser.profileImageUrl,
    });
    expect(response.statusCode).toBe(400);
  });

  test("Auth test register without email", async () => {
    const response = await request(app).post("/auth/register").send({
      password: testUser.password,
    });
    expect(response.statusCode).toBe(404);
  });

  test("Auth test google login fail", async () => {
    const response = await request(app).post("/auth/google").send({
      credential: "adsad"
    });
    expect(response.statusCode).not.toBe(200);
  })

  test("Auth test login", async () => {
    const response = await request(app).post("/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });
    expect(response.statusCode).toBe(200);
    const accessToken = response.body.accessToken;
    const refreshToken = response.body.refreshToken;
    testUser.accessToken = accessToken;
    testUser.refreshToken = refreshToken;
    expect(testUser.accessToken).not.toBeNull();
    expect(testUser.refreshToken).not.toBeNull();
  });

  test("Auth test change password with wrong password", async () => {
    const response = await request(app)
      .put("/auth/updatePassword")
      .set({
        Authorization: `JWT ${testUser.accessToken}`,
      })
      .send({
        email: testUser.email,
        oldPassword: "45678",
        newPassword: "4321",
      });
    expect(response.statusCode).not.toBe(200);
  });

  test("Auth test update without authorization", async () => {
    const response = await request(app).put("/auth").send({
      email: testUser.email,
      oldPassword: testUser.password,
      newPassword: "4321",
    });
    expect(response.statusCode).toBe(401);
  });

  test("Auth test update with wrong authorization", async () => {
    const response = await request(app)
      .put("/auth")
      .set({
        Authorization: `JWT ${testUser.accessToken}1`,
      })
      .send({
        email: testUser.email,
        oldPassword: testUser.password,
        newPassword: "4321",
      });
    expect(response.statusCode).toBe(403);
  });

  test("Auth test update with an existing user name and email", async () => {
    const response = await request(app).post("/auth/register").send({
      email: testUser2.email,
      password: testUser2.password,
      userName: testUser2.userName,
      profileImageUrl: testUser2.profileImageUrl,
    });
    expect(response.statusCode).toBe(201);

    const response2 = await request(app)
      .put("/auth")
      .set({
        Authorization: `JWT ${testUser.accessToken}`,
      })
      .send({
        password: testUser.password,
        email: testUser.email,
        userName: testUser2.userName,
      });
    expect(response2.statusCode).toBe(400);

    const response3 = await request(app)
      .put("/auth")
      .set({
        Authorization: `JWT ${testUser.accessToken}`,
      })
      .send({
        password: testUser.password,
        email: testUser2.email,
        userName: testUser.userName,
      });
    expect(response3.statusCode).toBe(400);
  });

  test("Auth test update with wrong password and without password", async () => {
    const response = await request(app)
      .put("/auth")
      .set({
        Authorization: `JWT ${testUser.accessToken}`,
      })
      .send({
        email: testUser.email,
      });
    expect(response.statusCode).not.toBe(200);

    const response2 = await request(app)
      .put("/auth")
      .set({
        Authorization: `JWT ${testUser.accessToken}`,
      })
      .send({
        password: "wrongPassword",
        email: testUser.email,
      });
    expect(response2.statusCode).not.toBe(200);
  });

  test("Auth test update", async () => {
    const response = await request(app)
      .put("/auth")
      .set({
        Authorization: `JWT ${testUser.accessToken}`,
      })
      .send({
        email: "newEmail@email.com",
        password: testUser.password,
        userName: "newName",
        profileImageUrl: "https://www.google2.com",
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.userName).toBe("newName");
    testUser.userName = "newName";
    testUser.email = "newEmail@email.com";
    testUser.profileImageUrl = "https://www.google2.com";
  });

  test("Auth test get profile image and name", async () => {
    const response = await request(app)
      .get("/auth/getProfileImageUrlAndName")
      .set({
        Authorization: `JWT ${testUser.accessToken}`,
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.userName).toBe(testUser.userName);
    expect(response.body.profileImageUrl).toBe(testUser.profileImageUrl);
  });

  test("Auth test get user info", async () => {
    const response = await request(app)
      .get("/auth/getUserInfo")
      .set({
        Authorization: `JWT ${testUser.accessToken}`,
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.userName).toBe(testUser.userName);
    expect(response.body.email).toBe(testUser.email);
    expect(response.body.profileImageUrl).toBe(testUser.profileImageUrl);
  });

  test("Auth test change password without all params", async () => {
    const response = await request(app)
      .put("/auth/updatePassword")
      .set({
        Authorization: `JWT ${testUser.accessToken}`,
      })
      .send({
        email: null,
        oldPassword: null,
        newPassword: "4321",
      });
    expect(response.statusCode).not.toBe(200);
  });

  test("Auth test change password", async () => {
    const response = await request(app)
      .put("/auth/updatePassword")
      .set({
        Authorization: `JWT ${testUser.accessToken}`,
      })
      .send({
        email: testUser.email,
        oldPassword: testUser.password,
        newPassword: "4321",
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.password).not.toBe(testUser.password);
    testUser.password = "4321";
  });

  test("Auth test login with wrong password", async () => {
    const response = await request(app).post("/auth/login").send({
      email: testUser.email,
      password: "wrongPassword",
    });
    expect(response.statusCode).not.toBe(200);
  });

  test("Auth test login without email", async () => {
    const response = await request(app).post("/auth/login").send({
      password: testUser.password,
    });
    expect(response.statusCode).toBe(404);
  });

  test("Auth test with wrong email", async () => {
    const response = await request(app).post("/auth/login").send({
      email: "wrongEmail",
      password: testUser.password,
    });
    expect(response.statusCode).toBe(400);
  });

  test("Auth test refresh when tokens deleted", async () => {
    const user = await UserModel.findOne({ email: testUser.email });
    const tempToken = testUser.refreshToken;
    if (user) {
      user.tokens = [];
      await user.save();
    }
    const response = await request(app)
      .post("/auth/refresh")
      .set({
        Authorization: `JWT ${testUser.refreshToken}`,
      });
    if (user) {
      if (tempToken) {
        user.tokens = [tempToken];
      }
      await user.save();
    }
    expect(response.statusCode).not.toBe(200);
  });

  test("Auth test refresh token", async () => {
    const response = await request(app)
      .post("/auth/refresh")
      .set({
        Authorization: `JWT ${testUser.refreshToken}`,
      });
    expect(response.statusCode).toBe(200);
    testUser.accessToken = response.body.accessToken;
    testUser.refreshToken = response.body.refreshToken;
  });

  test("Auth test refresh token without token", async () => {
    const response = await request(app).post("/auth/refresh").set({});
    expect(response.statusCode).toBe(401);
  });

  test("Auth test refresh token with wrong token", async () => {
    const response = await request(app)
      .post("/auth/refresh")
      .set({
        Authorization: `JWT ${testUser.refreshToken}1`,
      });
    expect(response.statusCode).toBe(403);
  });

  test("Auth test double use of refresh token", async () => {
    const response = await request(app)
      .post("/auth/refresh")
      .set({
        Authorization: `JWT ${testUser.refreshToken}`,
      });
    expect(response.statusCode).toBe(200);
    const response2 = await request(app)
      .post("/auth/refresh")
      .set({
        Authorization: `JWT ${testUser.refreshToken}`,
      });
    expect(response2.statusCode).toBe(200);
    const newRefreshToken = response.body.refreshToken;
    testUser.refreshToken = newRefreshToken;
  });

  test("Auth test logout without token", async () => {
    const response = await request(app).post("/auth/logout").set({});
    expect(response.statusCode).toBe(401);
  });

  test("Auth test logout with wrong token", async () => {
    const response = await request(app).post("/auth/logout").set({
      Authorization: `JWT wrongToken`,
    });
    expect(response.statusCode).toBe(403);
  });

  test("Auth test logout when user does not have token", async () => {
    const user = await UserModel.findOne({ email: testUser.email });
    const tempToken = testUser.refreshToken;
    if (user) {
      user.tokens = [];
      await user.save();
    }
    const response = await request(app)
      .post("/auth/logout")
      .set({
        Authorization: `JWT ${tempToken}`,
      });
    if (user) {
      if (tempToken) {
        user.tokens = [tempToken];
      }
      await user.save();
    }
    expect(response.statusCode).not.toBe(200);
  });

  test("Auth test logout", async () => {
    const response = await request(app)
      .post("/auth/logout")
      .set({
        Authorization: `JWT ${testUser.refreshToken}`,
      });
    expect(response.statusCode).toBe(200);
  });


  test("Auth test delete user", async () => {
    const response = await request(app).post("/auth/register").send({
      email: "test",
      password: "test",
      userName: "test",
      profileImageUrl: "test",
    });
    expect(response.statusCode).toBe(201);
    const response2 = await request(app).post("/auth/login").send({
      email: "test",
      password: "test",
    });
    expect(response2.statusCode).toBe(200);
    const accessToken = response2.body.accessToken;
    const response3 = await request(app)
      .delete("/auth/deleteUser")
      .set({
        Authorization: `JWT ${accessToken}`,
      })
    expect(response3.statusCode).toBe(200);
  });

  test("Auth test logout when user does not exist", async () => {
    await UserModel.deleteOne({ email: testUser.email });
    const response = await request(app)
      .post("/auth/logout")
      .set({
        Authorization: `JWT ${testUser.refreshToken}`,
      });
    expect(response.statusCode).not.toBe(200);
  });

  test("Auth refresh when user does not exist", async () => {
    const response = await request(app)
      .post("/auth/refresh")
      .set({
        Authorization: `JWT ${testUser.refreshToken}`,
      });
    expect(response.statusCode).not.toBe(200);
  });
});
