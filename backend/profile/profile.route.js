"use strict";

const PromiseRouter = require("express-promise-router");
const { validate } = require("express-validation");

const auth = require("../utils/auth");
const controller = require("./profile.controller");
const schema = require("./profile.schema");

const router = PromiseRouter();

router.get(
	"/:name",
	validate(schema.getProfile),
	controller.getProfile
);

module.exports = router;
