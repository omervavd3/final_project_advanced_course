"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var supertest_1 = require("supertest");
var server_1 = require("../server");
var mongoose_1 = require("mongoose");
var userModel_1 = require("../models/userModel");
var app;
beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("beforeAll");
                return [4 /*yield*/, (0, server_1.default)()];
            case 1:
                app = _a.sent();
                return [4 /*yield*/, userModel_1.default.deleteOne({ email: testUser.email })];
            case 2:
                _a.sent();
                return [4 /*yield*/, userModel_1.default.deleteOne({ email: testUser2.email })];
            case 3:
                _a.sent();
                return [4 /*yield*/, userModel_1.default.deleteOne({ email: "test" })];
            case 4:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
afterAll(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("afterAll");
                return [4 /*yield*/, userModel_1.default.deleteOne({ email: testUser.email })];
            case 1:
                _a.sent();
                return [4 /*yield*/, userModel_1.default.deleteOne({ email: testUser2.email })];
            case 2:
                _a.sent();
                return [4 /*yield*/, userModel_1.default.deleteOne({ email: "test" })];
            case 3:
                _a.sent();
                mongoose_1.default.connection.close();
                return [2 /*return*/];
        }
    });
}); });
var testUser = {
    email: "test@example.com",
    password: "1234",
    userName: "name test",
    profileImageUrl: "https://www.google.com",
};
var testUser2 = {
    email: "test@example2.com",
    password: "1234",
    userName: "name test 3",
    profileImageUrl: "https://www.google.com",
};
var userForRefresh = {
    email: "testRefresh@example.com",
    password: "4321",
    userName: "name test 2",
    profileImageUrl: "https://www.google.com",
    refreshToken: "123124534586756453",
    accessToken: "123124534586756453",
};
describe("User Tests", function () {
    test("Auth test register", function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app).post("/auth/register").send({
                        email: testUser.email,
                        password: testUser.password,
                        userName: testUser.userName,
                        profileImageUrl: testUser.profileImageUrl,
                    })];
                case 1:
                    response = _a.sent();
                    expect(response.statusCode).toBe(201);
                    expect(response.body.password).not.toBe(testUser.password);
                    return [2 /*return*/];
            }
        });
    }); });
    test("Auth test register with the same email again", function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app).post("/auth/register").send({
                        email: testUser.email,
                        password: testUser.password,
                        userName: testUser.userName,
                        profileImageUrl: testUser.profileImageUrl,
                    })];
                case 1:
                    response = _a.sent();
                    expect(response.statusCode).toBe(400);
                    return [2 /*return*/];
            }
        });
    }); });
    test("Auth test register without email", function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app).post("/auth/register").send({
                        password: testUser.password,
                    })];
                case 1:
                    response = _a.sent();
                    expect(response.statusCode).toBe(404);
                    return [2 /*return*/];
            }
        });
    }); });
    test("Auth test google login fail", function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app).post("/auth/google").send({
                        credential: "adsad"
                    })];
                case 1:
                    response = _a.sent();
                    expect(response.statusCode).not.toBe(200);
                    return [2 /*return*/];
            }
        });
    }); });
    test("Auth test login", function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, accessToken, refreshToken;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app).post("/auth/login").send({
                        email: testUser.email,
                        password: testUser.password,
                    })];
                case 1:
                    response = _a.sent();
                    expect(response.statusCode).toBe(200);
                    accessToken = response.body.accessToken;
                    refreshToken = response.body.refreshToken;
                    testUser.accessToken = accessToken;
                    testUser.refreshToken = refreshToken;
                    expect(testUser.accessToken).not.toBeNull();
                    expect(testUser.refreshToken).not.toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    test("Auth test change password with wrong password", function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app)
                        .put("/auth/updatePassword")
                        .set({
                        Authorization: "JWT ".concat(testUser.accessToken),
                    })
                        .send({
                        email: testUser.email,
                        oldPassword: "45678",
                        newPassword: "4321",
                    })];
                case 1:
                    response = _a.sent();
                    expect(response.statusCode).not.toBe(200);
                    return [2 /*return*/];
            }
        });
    }); });
    test("Auth test update without authorization", function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app).put("/auth").send({
                        email: testUser.email,
                        oldPassword: testUser.password,
                        newPassword: "4321",
                    })];
                case 1:
                    response = _a.sent();
                    expect(response.statusCode).toBe(401);
                    return [2 /*return*/];
            }
        });
    }); });
    test("Auth test update with wrong authorization", function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app)
                        .put("/auth")
                        .set({
                        Authorization: "JWT ".concat(testUser.accessToken, "1"),
                    })
                        .send({
                        email: testUser.email,
                        oldPassword: testUser.password,
                        newPassword: "4321",
                    })];
                case 1:
                    response = _a.sent();
                    expect(response.statusCode).toBe(403);
                    return [2 /*return*/];
            }
        });
    }); });
    test("Auth test update with an existing user name and email", function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, response2, response3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app).post("/auth/register").send({
                        email: testUser2.email,
                        password: testUser2.password,
                        userName: testUser2.userName,
                        profileImageUrl: testUser2.profileImageUrl,
                    })];
                case 1:
                    response = _a.sent();
                    expect(response.statusCode).toBe(201);
                    return [4 /*yield*/, (0, supertest_1.default)(app)
                            .put("/auth")
                            .set({
                            Authorization: "JWT ".concat(testUser.accessToken),
                        })
                            .send({
                            password: testUser.password,
                            email: testUser.email,
                            userName: testUser2.userName,
                        })];
                case 2:
                    response2 = _a.sent();
                    expect(response2.statusCode).toBe(400);
                    return [4 /*yield*/, (0, supertest_1.default)(app)
                            .put("/auth")
                            .set({
                            Authorization: "JWT ".concat(testUser.accessToken),
                        })
                            .send({
                            password: testUser.password,
                            email: testUser2.email,
                            userName: testUser.userName,
                        })];
                case 3:
                    response3 = _a.sent();
                    expect(response3.statusCode).toBe(400);
                    return [2 /*return*/];
            }
        });
    }); });
    test("Auth test update with wrong password and without password", function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, response2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app)
                        .put("/auth")
                        .set({
                        Authorization: "JWT ".concat(testUser.accessToken),
                    })
                        .send({
                        email: testUser.email,
                    })];
                case 1:
                    response = _a.sent();
                    expect(response.statusCode).not.toBe(200);
                    return [4 /*yield*/, (0, supertest_1.default)(app)
                            .put("/auth")
                            .set({
                            Authorization: "JWT ".concat(testUser.accessToken),
                        })
                            .send({
                            password: "wrongPassword",
                            email: testUser.email,
                        })];
                case 2:
                    response2 = _a.sent();
                    expect(response2.statusCode).not.toBe(200);
                    return [2 /*return*/];
            }
        });
    }); });
    test("Auth test update", function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app)
                        .put("/auth")
                        .set({
                        Authorization: "JWT ".concat(testUser.accessToken),
                    })
                        .send({
                        email: "newEmail@email.com",
                        password: testUser.password,
                        userName: "newName",
                        profileImageUrl: "https://www.google2.com",
                    })];
                case 1:
                    response = _a.sent();
                    expect(response.statusCode).toBe(200);
                    expect(response.body.userName).toBe("newName");
                    testUser.userName = "newName";
                    testUser.email = "newEmail@email.com";
                    testUser.profileImageUrl = "https://www.google2.com";
                    return [2 /*return*/];
            }
        });
    }); });
    test("Auth test get profile image and name", function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app)
                        .get("/auth/getProfileImageUrlAndName")
                        .set({
                        Authorization: "JWT ".concat(testUser.accessToken),
                    })];
                case 1:
                    response = _a.sent();
                    expect(response.statusCode).toBe(200);
                    expect(response.body.userName).toBe(testUser.userName);
                    expect(response.body.profileImageUrl).toBe(testUser.profileImageUrl);
                    return [2 /*return*/];
            }
        });
    }); });
    test("Auth test get user info", function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app)
                        .get("/auth/getUserInfo")
                        .set({
                        Authorization: "JWT ".concat(testUser.accessToken),
                    })];
                case 1:
                    response = _a.sent();
                    expect(response.statusCode).toBe(200);
                    expect(response.body.userName).toBe(testUser.userName);
                    expect(response.body.email).toBe(testUser.email);
                    expect(response.body.profileImageUrl).toBe(testUser.profileImageUrl);
                    return [2 /*return*/];
            }
        });
    }); });
    test("Auth test change password without all params", function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app)
                        .put("/auth/updatePassword")
                        .set({
                        Authorization: "JWT ".concat(testUser.accessToken),
                    })
                        .send({
                        email: null,
                        oldPassword: null,
                        newPassword: "4321",
                    })];
                case 1:
                    response = _a.sent();
                    expect(response.statusCode).not.toBe(200);
                    return [2 /*return*/];
            }
        });
    }); });
    test("Auth test change password", function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app)
                        .put("/auth/updatePassword")
                        .set({
                        Authorization: "JWT ".concat(testUser.accessToken),
                    })
                        .send({
                        email: testUser.email,
                        oldPassword: testUser.password,
                        newPassword: "4321",
                    })];
                case 1:
                    response = _a.sent();
                    expect(response.statusCode).toBe(200);
                    expect(response.body.password).not.toBe(testUser.password);
                    testUser.password = "4321";
                    return [2 /*return*/];
            }
        });
    }); });
    test("Auth test login with wrong password", function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app).post("/auth/login").send({
                        email: testUser.email,
                        password: "wrongPassword",
                    })];
                case 1:
                    response = _a.sent();
                    expect(response.statusCode).not.toBe(200);
                    return [2 /*return*/];
            }
        });
    }); });
    test("Auth test login without email", function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app).post("/auth/login").send({
                        password: testUser.password,
                    })];
                case 1:
                    response = _a.sent();
                    expect(response.statusCode).toBe(404);
                    return [2 /*return*/];
            }
        });
    }); });
    test("Auth test with wrong email", function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app).post("/auth/login").send({
                        email: "wrongEmail",
                        password: testUser.password,
                    })];
                case 1:
                    response = _a.sent();
                    expect(response.statusCode).toBe(400);
                    return [2 /*return*/];
            }
        });
    }); });
    test("Auth test refresh when tokens deleted", function () { return __awaiter(void 0, void 0, void 0, function () {
        var user, tempToken, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, userModel_1.default.findOne({ email: testUser.email })];
                case 1:
                    user = _a.sent();
                    tempToken = testUser.refreshToken;
                    if (!user) return [3 /*break*/, 3];
                    user.tokens = [];
                    return [4 /*yield*/, user.save()];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [4 /*yield*/, (0, supertest_1.default)(app)
                        .post("/auth/refresh")
                        .set({
                        Authorization: "JWT ".concat(testUser.refreshToken),
                    })];
                case 4:
                    response = _a.sent();
                    if (!user) return [3 /*break*/, 6];
                    if (tempToken) {
                        user.tokens = [tempToken];
                    }
                    return [4 /*yield*/, user.save()];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6:
                    expect(response.statusCode).not.toBe(200);
                    return [2 /*return*/];
            }
        });
    }); });
    test("Auth test refresh token", function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app)
                        .post("/auth/refresh")
                        .set({
                        Authorization: "JWT ".concat(testUser.refreshToken),
                    })];
                case 1:
                    response = _a.sent();
                    expect(response.statusCode).toBe(200);
                    testUser.accessToken = response.body.accessToken;
                    testUser.refreshToken = response.body.refreshToken;
                    return [2 /*return*/];
            }
        });
    }); });
    test("Auth test refresh token without token", function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app).post("/auth/refresh").set({})];
                case 1:
                    response = _a.sent();
                    expect(response.statusCode).toBe(401);
                    return [2 /*return*/];
            }
        });
    }); });
    test("Auth test refresh token with wrong token", function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app)
                        .post("/auth/refresh")
                        .set({
                        Authorization: "JWT ".concat(testUser.refreshToken, "1"),
                    })];
                case 1:
                    response = _a.sent();
                    expect(response.statusCode).toBe(403);
                    return [2 /*return*/];
            }
        });
    }); });
    test("Auth test double use of refresh token", function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, response2, newRefreshToken;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app)
                        .post("/auth/refresh")
                        .set({
                        Authorization: "JWT ".concat(testUser.refreshToken),
                    })];
                case 1:
                    response = _a.sent();
                    expect(response.statusCode).toBe(200);
                    return [4 /*yield*/, (0, supertest_1.default)(app)
                            .post("/auth/refresh")
                            .set({
                            Authorization: "JWT ".concat(testUser.refreshToken),
                        })];
                case 2:
                    response2 = _a.sent();
                    expect(response2.statusCode).toBe(200);
                    newRefreshToken = response.body.refreshToken;
                    testUser.refreshToken = newRefreshToken;
                    return [2 /*return*/];
            }
        });
    }); });
    test("Auth test logout without token", function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app).post("/auth/logout").set({})];
                case 1:
                    response = _a.sent();
                    expect(response.statusCode).toBe(401);
                    return [2 /*return*/];
            }
        });
    }); });
    test("Auth test logout with wrong token", function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app).post("/auth/logout").set({
                        Authorization: "JWT wrongToken",
                    })];
                case 1:
                    response = _a.sent();
                    expect(response.statusCode).toBe(403);
                    return [2 /*return*/];
            }
        });
    }); });
    test("Auth test logout when user does not have token", function () { return __awaiter(void 0, void 0, void 0, function () {
        var user, tempToken, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, userModel_1.default.findOne({ email: testUser.email })];
                case 1:
                    user = _a.sent();
                    tempToken = testUser.refreshToken;
                    if (!user) return [3 /*break*/, 3];
                    user.tokens = [];
                    return [4 /*yield*/, user.save()];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [4 /*yield*/, (0, supertest_1.default)(app)
                        .post("/auth/logout")
                        .set({
                        Authorization: "JWT ".concat(tempToken),
                    })];
                case 4:
                    response = _a.sent();
                    if (!user) return [3 /*break*/, 6];
                    if (tempToken) {
                        user.tokens = [tempToken];
                    }
                    return [4 /*yield*/, user.save()];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6:
                    expect(response.statusCode).not.toBe(200);
                    return [2 /*return*/];
            }
        });
    }); });
    test("Auth test logout", function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app)
                        .post("/auth/logout")
                        .set({
                        Authorization: "JWT ".concat(testUser.refreshToken),
                    })];
                case 1:
                    response = _a.sent();
                    expect(response.statusCode).toBe(200);
                    return [2 /*return*/];
            }
        });
    }); });
    test("Auth test delete user with wrong password", function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app)
                        .delete("/auth/deleteUser")
                        .set({
                        Authorization: "JWT ".concat(testUser.accessToken),
                    })
                        .send({
                        password: "wrongPassword",
                    })];
                case 1:
                    response = _a.sent();
                    expect(response.statusCode).not.toBe(200);
                    return [2 /*return*/];
            }
        });
    }); });
    test("Auth test delete user without password", function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app)
                        .delete("/auth/deleteUser")
                        .set({
                        Authorization: "JWT ".concat(testUser.accessToken),
                    })];
                case 1:
                    response = _a.sent();
                    expect(response.statusCode).not.toBe(200);
                    return [2 /*return*/];
            }
        });
    }); });
    test("Auth test delete user", function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, response2, accessToken, response3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app).post("/auth/register").send({
                        email: "test",
                        password: "test",
                        userName: "test",
                        profileImageUrl: "test",
                    })];
                case 1:
                    response = _a.sent();
                    expect(response.statusCode).toBe(201);
                    return [4 /*yield*/, (0, supertest_1.default)(app).post("/auth/login").send({
                            email: "test",
                            password: "test",
                        })];
                case 2:
                    response2 = _a.sent();
                    expect(response2.statusCode).toBe(200);
                    accessToken = response2.body.accessToken;
                    return [4 /*yield*/, (0, supertest_1.default)(app)
                            .delete("/auth/deleteUser")
                            .set({
                            Authorization: "JWT ".concat(accessToken),
                        })
                            .send({
                            password: "test",
                        })];
                case 3:
                    response3 = _a.sent();
                    expect(response3.statusCode).toBe(200);
                    return [2 /*return*/];
            }
        });
    }); });
    test("Auth test logout when user does not exist", function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, userModel_1.default.deleteOne({ email: testUser.email })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, supertest_1.default)(app)
                            .post("/auth/logout")
                            .set({
                            Authorization: "JWT ".concat(testUser.refreshToken),
                        })];
                case 2:
                    response = _a.sent();
                    expect(response.statusCode).not.toBe(200);
                    return [2 /*return*/];
            }
        });
    }); });
    test("Auth refresh when user does not exist", function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app)
                        .post("/auth/refresh")
                        .set({
                        Authorization: "JWT ".concat(testUser.refreshToken),
                    })];
                case 1:
                    response = _a.sent();
                    expect(response.statusCode).not.toBe(200);
                    return [2 /*return*/];
            }
        });
    }); });
});
