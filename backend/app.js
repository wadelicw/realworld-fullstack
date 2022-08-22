"use strict";

const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const express = require("express");
const bodyParser = require("body-parser");
const compression = require("compression");
const methodOverride = require("method-override");

const IS_PRODUCTION = process.env.NODE_ENV === "production";

const app = express();

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan(IS_PRODUCTION ? "tiny" : "dev"));

app.use("/api", require("./index.route"));

module.exports = app;
