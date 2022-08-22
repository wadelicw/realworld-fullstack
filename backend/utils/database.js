"use strict";

const knex = require("knex");
const getConfig = require("../config");

const database = knex({
	client: "mysql2",
	pool: {
		min: 2,
		max: 5
	},
	useNullAsDefault: true,
	connection: async () => {
		const config = await getConfig();
		return {
			database: "RealWorldDb",
			host: config.DB_HOST,
			port: config.DB_PORT,
			user: config.DB_USERNAME,
			password: config.DB_PASSWORD
		}
	}
});

module.exports = database;
