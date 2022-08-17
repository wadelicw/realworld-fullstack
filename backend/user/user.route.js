"use strict";

const PromiseRouter = require("express-promise-router");
const { validate } = require("express-validation");

// const auth = require("../utils/auth");
const controller = require("./user.controller");
const schema = require("./user.schema");

const router = PromiseRouter();

router.post(
	"/login",
	validate(schema.login),
	controller.login
);

router
	.route("/")
	.post(
		validate(schema.register),
		controller.register
	);

module.exports = router;
