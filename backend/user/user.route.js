"use strict";

const PromiseRouter = require("express-promise-router");
const { validate } = require("express-validation");

const auth = require("../utils/auth");
const controller = require("./user.controller");
const schema = require("./user.schema");

const router = PromiseRouter();

router.post(
	"/users/login",
	validate(schema.login),
	controller.login
);

router.post(
	"/users",
	validate(schema.register),
	controller.register
);

router
	.route("/user")
	.get(auth, controller.getMe)
	.put(auth, validate(schema.update), controller.update);

module.exports = router;
