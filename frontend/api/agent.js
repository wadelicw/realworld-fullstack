"use strict";
const axios = require("axios");
const store = require("../store");

function get() {

	// const access_token = store.getStore().getState().base.access_token;
	const headers = {};

	// if (access_token) {
	// 	headers["Authorization"] = `Bearer ${access_token}`;
	// }

	const agent = axios.create({
		baseURL: process.env.NEXT_PUBLIC_DOMAIN ?? "http://localhost:3200",
		headers
	});

	agent
		.interceptors
		.response
		.use(
			null,
			function (error) {
				error.message = error?.response?.statusText;
				error.status = error?.response?.status;
				return Promise.reject(error);
			}
		);

	return agent;
}

module.exports.get = get;
