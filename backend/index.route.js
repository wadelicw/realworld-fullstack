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

    return next(error);
});


module.exports = router;
