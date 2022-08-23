"use strict";

const agent = require("./agent");

module.exports = {

	login(user) {
		return agent
			.get()
			.post("/api/users/login", { user })
			.then((response) => response.data);
	},

	register(user) {
		return agent
			.get()
			.post("/api/users", { user })
			.then((response) => response.data);
	},

	me(accessToken) {
		return agent
			.get()
			.get(
				"/api/user",
				{ headers: { Authorization: `Bearer ${accessToken}` } }
			)
			.then((response) => response.data);
	}

};
