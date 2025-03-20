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
var postModel_1 = require("../models/postModel");
var likesModel_1 = require("../models/likesModel");
var app;
var testUser = {
    email: "test@example.com",
    password: "1234",
    userName: "name test",
    profileImageUrl: "https://www.google.com",
};
var testPost = {
    title: "Test Title",
    content: "Test Content",
    photo: "https://www.google.com",
};
var testLike = {};
beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
    var res, res2, res3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("beforeAll");
                return [4 /*yield*/, (0, server_1.default)()];
            case 1:
                app = _a.sent();
                return [4 /*yield*/, postModel_1.default.deleteMany()];
            case 2:
                _a.sent();
                return [4 /*yield*/, userModel_1.default.deleteMany()];
            case 3:
                _a.sent();
                return [4 /*yield*/, likesModel_1.default.deleteMany()];
            case 4:
                _a.sent();
                return [4 /*yield*/, (0, supertest_1.default)(app).post("/auth/register").send({
                        email: testUser.email,
                        password: testUser.password,
                        userName: testUser.userName,
                        profileImageUrl: testUser.profileImageUrl,
                    })];
            case 5:
                res = _a.sent();
                console.log("res: " + res.statusCode);
                testUser._id = res.body._id;
                testPost.owner = res.body._id;
                return [4 /*yield*/, (0, supertest_1.default)(app).post("/auth/login").send({
                        email: testUser.email,
                        password: testUser.password,
                    })];
            case 6:
                res2 = _a.sent();
                testUser.refreshToken = res2.body.refreshToken;
                testUser.accessToken = res2.body.accessToken;
                expect(testUser.refreshToken).toBeDefined();
                expect(testUser.accessToken).toBeDefined();
                return [4 /*yield*/, (0, supertest_1.default)(app)
                        .post("/posts")
                        .set({
                        Authorization: "JWT ".concat(testUser.accessToken),
                    })
                        .send({
                        owner: testPost.owner,
                        ownerName: testUser.userName,
                        ownerPhoto: testUser.profileImageUrl,
                        photo: testPost.photo,
                        title: testPost.title,
                        content: testPost.content,
                    })];
            case 7:
                res3 = _a.sent();
                expect(res3.statusCode).toBe(201);
                testPost._id = res3.body._id;
                return [2 /*return*/];
        }
    });
}); });
afterAll(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("afterAll");
                return [4 /*yield*/, postModel_1.default.deleteMany()];
            case 1:
                _a.sent();
                return [4 /*yield*/, userModel_1.default.deleteMany()];
            case 2:
                _a.sent();
                return [4 /*yield*/, likesModel_1.default.deleteMany()];
            case 3:
                _a.sent();
                mongoose_1.default.connection.close();
                return [2 /*return*/];
        }
    });
}); });
describe("User Tests", function () {
    test("Likes create like", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app)
                        .post("/likes")
                        .set({
                        authorization: "JWT ".concat(testUser.accessToken),
                    })
                        .send({
                        postId: testPost._id,
                        value: 1,
                    })];
                case 1:
                    res = _a.sent();
                    expect(res.statusCode).toBe(201);
                    expect(res.body.owner).toBe(testUser._id);
                    testLike._id = res.body._id;
                    testLike.owner = res.body.owner;
                    testLike.postId = res.body.postId;
                    testLike.date = res.body.date;
                    return [2 /*return*/];
            }
        });
    }); });
    test("Likes get by user id", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app)
                        .get("/likes/getByUserId")
                        .set({
                        authorization: "JWT ".concat(testUser.accessToken),
                    })];
                case 1:
                    res = _a.sent();
                    expect(res.statusCode).toBe(200);
                    expect(res.body[0].owner).toBe(testUser._id);
                    return [2 /*return*/];
            }
        });
    }); });
    test("Likes get by user and post", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app)
                        .post("/likes/getByUserAndPost")
                        .set({
                        authorization: "JWT ".concat(testUser.accessToken),
                    })
                        .send({
                        postId: testPost._id,
                    })];
                case 1:
                    res = _a.sent();
                    expect(res.statusCode).toBe(200);
                    expect(res.body[0].owner).toBe(testUser._id);
                    return [2 /*return*/];
            }
        });
    }); });
    test("Likes remove like after create", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app)
                        .post("/likes")
                        .set({
                        authorization: "JWT ".concat(testUser.accessToken),
                    })
                        .send({
                        postId: testPost._id,
                        value: -1,
                    })];
                case 1:
                    res = _a.sent();
                    expect(res.statusCode).toBe(200);
                    return [2 /*return*/];
            }
        });
    }); });
    test("Likes create fail", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(app)
                        .post("/likes")
                        .set({
                        authorization: "JWT ".concat(testUser.accessToken),
                    })
                        .send({
                        postId: testPost._id,
                        value: 10,
                    })];
                case 1:
                    res = _a.sent();
                    expect(res.statusCode).not.toBe(200);
                    return [2 /*return*/];
            }
        });
    }); });
});
