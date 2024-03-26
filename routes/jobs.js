"use strict";

/** Routes for jobs. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureLoggedIn, ensureAdmin } = require("../middleware/auth");
const Job = require("../models/job");

const jobNewSchema = require("../schemas/jobNew.json");
const jobUpdateSchema = require("../schemas/jobUpdate.json");

const router = new express.Router();

/** POST / { job } =>  { job } 
 * 
 * job should be { title, salary, equity, companyHandle }
 * 
 * Returns { id, title, salary, equity, companyHandle }
 * 
 * Authorization required: admin
 */

router.post("/", ensureAdmin, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, jobNewSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const job = await Job.create(req.body);
        return res.status(201).json({ job });
    } catch (err) {
        return next(err);
    }
});

/** GET /  =>
 *   { jobs: [ { id, title, salary, equity, companyHandle }, ...] }
 * 
 * Can filter on provided search filters:
 * - title (will find case-insensitive, partial matches)
 * - minSalary
 * - hasEquity
 * 
 * Authorization required: none
 */

router.get("/", async function (req, res, next) {
    try {
        // get filters from query string
        const { title, minSalary, hasEquity } = req.query;

        if( title || minSalary || hasEquity ) {
            // validate title is a string
            if (title && typeof title !== "string") {
                return res.status(400).json({ error: "title must be a string" });
            }
            // validate minSalary is a number
            if(minSalary && isNaN(minSalary)) {
                return res.status(400).json({ error: "minSalary must be a number" });
            }

            // validate hasEquity is a boolean
            if(hasEquity && hasEquity !== "true" && hasEquity !== "false") {
                return res.status(400).json({ error: "hasEquity must be a boolean" });
            }

            const jobs = await Job.filter({ title, minSalary, hasEquity });
            return res.json({ jobs });
        }

        // if no filters, return all jobs
        const jobs = await Job.findAll();
        return res.json({ jobs });

    } catch (err) {
        return next(err);
    }
});

/** GET /[id] => { job } 
 * 
 * Job is { id, title, salary, equity, companyHandle }
 *   where jobs is [{ id, title, salary, equity }, ...]
 * 
 * Authorization required: none
 */

router.get("/:id", ensureAdmin,async function (req, res, next) {
    try {
        const job = await Job.get(req.params.id);
        return res.json({ job });
    } catch (err) {
        return next(err);
    }
});

/** PATCH /[id] { fld1, fld2, ... } => { job }
 * 
 * Patches job data.
 * 
 * fields can be: { title, salary, equity, companyHandle }
 * 
 * Returns { id, title, salary, equity, companyHandle }
 * 
 * Authorization required: admin
 */

router.patch("/:id", ensureAdmin, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, jobUpdateSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const job = await Job.update(req.params.id, req.body);
        return res.json({ job });
    } catch (err) {
        return next(err);
    }
});

/** DELETE /[id]  =>  { deleted: id }
 * 
 * Authorization: admin
 */

router.delete("/:id", ensureAdmin, async function (req, res, next) {
    try {
        await Job.remove(req.params.id);
        return res.json({ deleted: req.params.id });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;