"use strict";
const fs = require("fs");
const pug = require("pug");
const path = require("path");
const Swagger = require("./swagger/swagger.model");

const complier = pug.compile(
	fs.readFileSync(
		path.join(__dirname, "./swagger/swagger.view.pug")
	),
	{
		pretty: process.env.NODE_ENV !== "production"
	}
);

async function generateSwagger(req, res) {
	const json = await Swagger.get();
	const html = complier(json);
	res.removeHeader("content-security-policy");
	res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
	return res.send(html);
}

module.exports = {
	generateSwagger
};
