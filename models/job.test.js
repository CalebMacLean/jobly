"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const Job = require("./job");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", function () {
    const newJob = {
        title: "new",
        salary: 1,
        equity: 0.1,
        companyHandle: "c1"
    };
    
    test("works", async function () {
        let job = await Job.create(newJob);
        expect(job).toEqual({
            id: expect.any(Number),
            title: "new",
            salary: 1,
            equity: "0.1",
            companyHandle: "c1"
        });

        const result = await db.query(
            `SELECT id, title, salary, equity, company_handle
            FROM jobs
            WHERE title = 'new'`);
        expect(result.rows).toEqual([
            {
                id: expect.any(Number),
                title: "new",
                salary: 1,
                equity: "0.1",
                company_handle: "c1"
            }
        ]);
    });

    test("bad request with dupe", async function () {
        try {
            await Job.create(newJob);
            await Job.create(newJob);
            fail();

        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});

/************************************** findAll */

describe("findAll", function() {
    test("works: no filter", async function() {
        let jobs = await Job.findAll();
        console.log("Find All Jobs", jobs)
        expect(jobs).toEqual([
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
            }
        ]);
    });
});

/************************************** get */
describe("get", function () {
    test("works", async function () {
        let job = await Job.get(1);
        expect(job).toEqual({
            id: 1,
            title: "j1",
            salary: 1,
            equity: "0.1",
            companyHandle: "c1"
        });
    });

    test("not found if no such job", async function () {
        try {
            await Job.get(0);
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});

/************************************** update */

describe("update", function () {
    const updateData = {
        title: "new",
        salary: 100,
        equity: 0.1,
    };

    test("works", async function () {
        let job = await Job.update(1, updateData);
        expect(job).toEqual({
            id: 1,
            title: "new",
            salary: 100,
            equity: "0.1",
            companyHandle: "c1"
        });

        const result = await db.query(
            `SELECT id, title, salary, equity, company_handle
            FROM jobs
            WHERE id = 1`);
        expect(result.rows).toEqual([{
            id: 1,
            title: "new",
            salary: 100,
            equity: "0.1",
            company_handle: "c1"
        }]);
    });

    test("works: null fields", async function () {
        const updateDataSetNulls = {
            title: "new",
        };

        let job = await Job.update(1, updateDataSetNulls);
        expect(job).toEqual({
            id: 1,
            title: "new",
            salary: 1,
            equity: "0.1",
            companyHandle: "c1"
        });

        const result = await db.query(
            `SELECT id, title, salary, equity, company_handle
            FROM jobs
            WHERE id = 1`);
        expect(result.rows).toEqual([{
            id: 1,
            title: "new",
            salary: 1,
            equity: "0.1",
            company_handle: "c1"
        }]);
    });

    test("not found if no such job", async function () {
        try {
            await Job.update(0, updateData);
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });

    test("bad request with no data", async function () {
        try {
            await Job.update(1, {});
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});

/************************************** remove */

describe("remove", function () {
    test("works", async function () {
        await Job.remove(1);
        const res = await db.query(
            "SELECT id FROM jobs WHERE id=1");
        expect(res.rows.length).toEqual(0);
    });

    test("not found if no such job", async function () {
        try {
            await Job.remove(0);
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});

/************************************** filter */
describe("filter", function () {
    test("works: title", async function () {
        let filterData = { title: "j1" };
        let jobs = await Job.filter(filterData);
        expect(jobs).toEqual([
            {
                id: expect.any(Number),
                title: "j1",
                salary: 1,
                equity: "0.1",
                companyHandle: "c1"
            }
        ]);
    });

    test("works: minSalary", async function () {
        let filterData = { minSalary: 2 };
        let jobs = await Job.filter(filterData);
        expect(jobs).toEqual([
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
            }
        ]);
    });

    test("works: hasEquity", async function () {
        let filterData = { hasEquity: true };
        let jobs = await Job.filter(filterData);
        expect(jobs).toEqual([
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
            }
        ]);
    });

    test("works: companyHandle", async function () {
        let filterData = { companyHandle: "c1" };
        let jobs = await Job.filter(filterData);
        expect(jobs).toEqual([
            {
                id: expect.any(Number),
                title: "j1",
                salary: 1,
                equity: "0.1",
                companyHandle: "c1"
            }
        ]);
    });

    test("works: all filters", async function () {
        let filterData = { 
            title: "j1", 
            minSalary: 1, 
            hasEquity: true, 
            companyHandle: "c1" };
        let jobs = await Job.filter(filterData);
        expect(jobs).toEqual([
            {
                id: expect.any(Number),
                title: "j1",
                salary: 1,
                equity: "0.1",
                companyHandle: "c1"
            }
        ]);
    });
});