"use strict";

const express = require("express");
const logger = require("./utils/logger");
const { ValidationError } = require("express-validation");

const router = express.Router();

router.get(
    "/health-check",
    (req, res) => res.send("OK")
);

router.use("/", require("./user/user.route"));

router.use((error, req, res, next) => {

    // customize Joi validation errors
    if (error instanceof ValidationError) {
        res.status(error.statusCode).json(error);
    }

    switch (error.status) {
		case 400:
		case 401:
		case 403:
		case 404:
			res.status(error.status).json({});
			break;

		case 500:
		default:
            logger.error(error, { label: "Unexpected Error" });
			res.status(500).json({});
			break;
    }
    
    return next(error);
});


module.exports = router;
