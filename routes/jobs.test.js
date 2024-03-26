"use strict";

/** Imports */
const request = require("supertest");

const db = require("../db");
const app = require("../app");

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    u1Token,
    adminToken,
    } = require("./_testCommon");

/** Set Up and Tear Down */
beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);


/************************************** POST /jobs */

describe("POST /jobs", function () {
    const newJob = {
        title: "new",
        salary: 100000,
        equity: 0.1,
        companyHandle: "c1"
    };
    test("ok for admins", async function () {
        const resp = await request(app)
            .post("/jobs")
            .send(newJob)
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.statusCode).toEqual(201);
        expect(resp.body).toEqual({
            job: {
                id: expect.any(Number),
                title: "new",
                salary: 100000,
                equity: "0.1",
                companyHandle: "c1"
            },
        });
    });

    test("bad request with missing data", async function () {
        const resp = await request(app)
            .post("/jobs")
            .send({
                title: "new",
                salary: 100000,
            })
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.statusCode).toEqual(400);
    });

    test("bad request with invalid data", async function () {
        const resp = await request(app)
            .post("/jobs")
            .send({
                ...newJob,
                salary: "not-a-number"
            })
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.statusCode).toEqual(400);
    });
});

/********************************************************* GET /jobs */

describe("GET /jobs", function () {
    test("ok for anon", async function () {
        const resp = await request(app).get("/jobs");
        expect(resp.body).toEqual({
            jobs: [
                {
                    id: expect.any(Number),
                    title: "j1",
                    salary: 1,
                    equity: "0.1",
                    companyHandle: "c1"
                },
                {
                    id: expect.any(Number),
                    title: "j2",
                    salary: 2,
                    equity: "0.2",
                    companyHandle: "c2"
                },
                {
                    id: expect.any(Number),
                    title: "j3",
                    salary: 3,
                    equity: "0.3",
                    companyHandle: "c3"
                },
            ],
        });
    });

    test("fails: test next() handler", async function () {
        // there's no way to force an error in a query
        await db.query("DROP TABLE jobs CASCADE");
        const resp = await request(app)
            .get("/jobs")
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(500);
    });
});

/************************************** GET /jobs/ with filters*/

describe("GET /jobs/?", function () {
    test("filters work", async function () {
        const resp = await request(app).get("/jobs?title=j1");
        expect(resp.body).toEqual({
            jobs: [
                {
                    id: expect.any(Number),
                    title: "j1",
                    salary: 1,
                    equity: "0.1",
                    companyHandle: "c1"
                },
            ],
        });
    });

    test("ok with non-existent title", async function () {
        const resp = await request(app).get("/jobs?title=not-a-title");
        expect(resp.statusCode).toEqual(200);
        expect(resp.body).toEqual({ jobs: [] });
    });
});

/**************************************** GET /jobs/:id */

describe("GET /jobs", function () {
    test("works for anon", async function () {
        const resp = await request(app).get(`/jobs`);
        console.log("resp", resp.body);
        const jobRes = await request(app).get("/jobs");
        console.log("jobRes", jobRes.body);
        expect(resp.body).toEqual({
            jobs: [
                {
                    id: expect.any(Number),
                    title: "j1",
                    salary: 1,
                    equity: "0.1",
                    companyHandle: "c1"
                },
                {
                    id: expect.any(Number),
                    title: "j2",
                    salary: 2,
                    equity: "0.2",
                    companyHandle: "c2"
                },
                {
                    id: expect.any(Number),
                    title: "j3",
                    salary: 3,
                    equity: "0.3",
                    companyHandle: "c3"
                },
            ],
        });
    });
});

/************************************** PATCH /jobs/:id */

describe("PATCH /jobs/:id", function () {
    test("works for admins", async function () {
        const resp = await request(app)
            .patch(`/jobs/${1}`)
            .send({
                title: "new",
            })
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.body).toEqual({
            job: {
                id: 1,
                title: "new",
                salary: 1,
                equity: "0.1",
                companyHandle: "c1"
            },
        });
    });

    test("unauth for anon", async function () {
        const resp = await request(app)
            .patch(`/jobs/${1}`)
            .send({
                title: "new",
            });
        expect(resp.statusCode).toEqual(401);
    });

    test("not found on no such job", async function () {
        const resp = await request(app)
            .patch(`/jobs/0`)
            .send({
                title: "new nope",
            })
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.statusCode).toEqual(404);
    });

    test("bad request on id change attempt", async function () {
        const resp = await request(app)
            .patch(`/jobs/${1}`)
            .send({
                id: 0,
            })
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.statusCode).toEqual(400);
    });
});

/************************************** DELETE /jobs/:id */

describe("DELETE /jobs/:id", function () {
    test("works for admins", async function () {
        const resp = await request(app)
            .delete(`/jobs/${1}`)
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.body).toEqual({ deleted: "1" });
    });

    test("unauth for anon", async function () {
        const resp = await request(app)
            .delete(`/jobs/${1}`);
        expect(resp.statusCode).toEqual(401);
    });

    test("not found for no such job", async function () {
        const resp = await request(app)
            .delete(`/jobs/0`)
            .set("authorization", `Bearer ${adminToken}`);
        expect(resp.statusCode).toEqual(404);
    });
});