"use strict";

const axios = require("axios");
const store = require("../store");

function get() {
	const accessToken = store.getStore().getState().user;
	const headers = {};

	if (accessToken) {
		headers.Authorization = `Bearer ${accessToken}`;
	}

	const agent = axios.create({
		baseURL: process.env.NEXT_PUBLIC_DOMAIN ?? "http://localhost:3200",
		headers
	});

	agent
		.interceptors
		.response
		.use(
			null,
			(error) => {
				error.message = error?.response?.data?.message;
				error.status = error?.response?.data?.statusCode;
				error.code = error?.response?.data?.code;
				return Promise.reject(error);
			}
		);

	return agent;
}

module.exports.get = get;
