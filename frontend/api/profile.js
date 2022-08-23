"use strict";

const agent = require("./agent");

module.exports = {

	getProfile(name) {
		return agent
			.get()
			.get("/api/profile/" + name)
			.then((response) => response.data);
	},

};
