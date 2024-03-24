"use strict";

/** Convenience middleware to handle common auth cases in routes. */

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../expressError");


/** Middleware: Authenticate user.
 *
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals (this will include the username and isAdmin field.)
 *
 * It's not an error if no token was provided or if the token is not valid.
 */

function authenticateJWT(req, res, next) {
  try {
    const authHeader = req.headers && req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace(/^[Bb]earer /, "").trim();
      res.locals.user = jwt.verify(token, SECRET_KEY);
    }
    return next();
  } catch (err) {
    return next();
  }
}

/** Middleware to use when they must be logged in.
 *
 * If not, raises Unauthorized.
 */

function ensureLoggedIn(req, res, next) {
  try {
    if (!res.locals.user) throw new UnauthorizedError();
    return next();
  } catch (err) {
    return next(err);
  }
}

/** Middleware: Requires user is admin.
 * 
 * If not an admin, raises Unauthorized.
 */
function ensureAdmin(req, res, next) {
  try {
    const user = res.locals.user;
    // if user is and is an admin, return next
    if (user && user.isAdmin) return next();
    // otherwise, throw an unauthorized error
    throw new UnauthorizedError();

  } catch (err) {
    return next(err);
  }
}

/** Middleware: Requires user matches target user for data modification.
 * 
 * If not the correct user, raises Unauthorized.
 */
function ensureCorrectUser(req, res, next) {
  try {
    const user = res.locals.user;
    // if user is and is an admin, return next
    if(user && (user.isAdmin || user.username === req.params.username)) return next();

    // otherwise, throw an unauthorized error
    throw new UnauthorizedError();

  } catch (err) {
    return next(err);
  }
}

/** Middleware: Requires user is an admin or matches user for data modification.
 * 
 * If not the correct user, raises Unauthorized.
 */
function ensureAdminOrCorrectUser(req, res, next) {
  try {
    const user = res.locals.user;
    // if user is and is an admin, return next
    if(user && (user.isAdmin || user.username === req.params.username)) return next();

    // otherwise, throw an unauthorized error
    throw new UnauthorizedError();

  } catch (err) {
    return next(err);
  }
};

module.exports = {
  authenticateJWT,
  ensureLoggedIn,
  ensureAdmin,
  ensureCorrectUser,
  ensureAdminOrCorrectUser
};
