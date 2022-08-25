"use strict";

const axios = require("axios");

function get() {
	const accessToken = localStorage.getItem(process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY);
	const headers = {};

	if (accessToken) {
		headers.Authorization = `Bearer ${accessToken}`;
	}

	const agent = axios.create({
		baseURL: process.env.NEXT_PUBLIC_DOMAIN,
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
