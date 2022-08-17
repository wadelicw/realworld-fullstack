"use strict";

const express = require("express");

const router = express.Router();

router.get(
	"/health-check",
	(req, res) => res.send("OK")
);

module.exports = router;
