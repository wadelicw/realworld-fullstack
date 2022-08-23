"use strict";

const express = require("express");
const { ValidationError } = require("express-validation");

const router = express.Router();

router.get(
	"/health-check",
	(req, res) => res.send("OK")
);

router.use("/", require("./user/user.route"));
router.use("/profile", require("./profile/profile.route"));

router.use((error, req, res, next) => {
	// customize Joi validation errors
	if (error instanceof ValidationError) {
		res.status(error.statusCode).json(error);
	}

	return next(error);
});

module.exports = router;
