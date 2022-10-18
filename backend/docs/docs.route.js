"use strict";

const PromiseRouter = require("express-promise-router");
const controller = require("./docs.controller");

const router = PromiseRouter();

router.get("/", controller.generateSwagger);

module.exports = router;
