"use strict";

/** Shared config for application; can be required many places. */

// dotenv is a zero-dependency module that loads environment variables from a .env file into process.env.
require("dotenv").config();
// colors is a Node.js library for terminal highlighting
require("colors");

// Pull in the NODE_ENV
const SECRET_KEY = process.env.SECRET_KEY || "secret-dev";

// + is a unary operator that converts its operand to Number type.
const PORT = +process.env.PORT || 3001;

// DB Environment Vars
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const databaseURL = 
console.log("username:", username);
console.log("password:", password);

// Use dev database, testing database, or via env var, production database
function getDatabaseUri() {
  return (process.env.NODE_ENV === "test")
      ? `postgresql://${username}:${password}@localhost/jobly_test`
      : process.env.DATABASE_URL || `postgresql://${username}:${password}@localhost/jobly`; //create a env var DATABASE_URL
}

// Speed up bcrypt during tests, since the algorithm safety isn't being tested
//
// WJB: Evaluate in 2021 if this should be increased to 13 for non-test use
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

console.log("Jobly Config:".green);
console.log("SECRET_KEY:".yellow, SECRET_KEY);
console.log("PORT:".yellow, PORT.toString());
console.log("BCRYPT_WORK_FACTOR".yellow, BCRYPT_WORK_FACTOR);
console.log("Database:".yellow, getDatabaseUri());
console.log("---");

module.exports = {
  SECRET_KEY,
  PORT,
  BCRYPT_WORK_FACTOR,
  getDatabaseUri,
  username,
  password
};
