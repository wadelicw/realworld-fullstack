"use strict";

const PromiseRouter = require("express-promise-router");
const { validate } = require("express-validation");

const auth = require("../utils/auth");
const controller = require("./profile.controller");
const schema = require("./profile.schema");

const router = PromiseRouter();

router.get(
	"/:name",
	function (req, res, next) {
		if (req.headers.authorization) {
			auth(req, res, next);
		} else {
			next();
		}
	},
	validate(schema.getProfile),
	controller.getProfile
);

router
	.route("/:name/follow")
	.post(auth, controller.follow)
	.delete(auth, controller.unFollow);

module.exports = router;
