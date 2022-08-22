"use strict";

require("dotenv").config();
const AWS = require("aws-sdk");
const mem = require("mem");
const logger = require("./utils/logger");

if (process.env.NODE_ENV === "development") {
	const credentials = new AWS.SharedIniFileCredentials({ profile: "wade" });
	AWS.config.credentials = credentials;
}

const ssm = new AWS.SSM({
	region: "ap-east-1"
});

const MAPPER = {
	jwt_signature: "AUTH_SIGNATURE",
	mysql_host: "DB_HOST",
	mysql_user: "DB_USERNAME",
	mysql_password: "DB_PASSWORD",
	mysql_port: "DB_PORT"
};

async function synchronize() {
	let response;
	let items = [];

	do {
		response = await ssm
			.getParametersByPath({
				Path: "/auth",
				WithDecryption: true,
				Recursive: true,
				NextToken: response?.NextToken
			})
			.promise();
		items = [].concat(items, response.Parameters);
	} while (response?.NextToken);

	const env = {};

	items.forEach((row) => {
		env[MAPPER[row.Name.replace("/auth/", "")]] = row.Value;
	});

	logger.debug("[System] Completed on setup environment ");

	return env;
}

module.exports = mem(synchronize);
