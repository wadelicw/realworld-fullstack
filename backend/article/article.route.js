"use strict";

const PromiseRouter = require("express-promise-router");
const { validate } = require("express-validation");

const auth = require("../utils/auth");
const controller = require("./article.controller");
const schema = require("./article.schema");

const router = PromiseRouter();

router
	.route("/")
	.post(
		auth,
		validate(schema.create),
		controller.create
	);

module.exports = router;
