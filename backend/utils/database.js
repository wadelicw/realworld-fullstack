"use strict";
const knex = require("knex");

const database = knex({
	client: "mysql",
	pool: {
		min: 2,
		max: 5
	},
	useNullAsDefault: true,
	connection: {
		database: "RealWorldDb",
		host: process.env.DB_HOST,
		port: process.env.DB_PORT || 3306,
		user: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD
	}
});

module.exports = database;
