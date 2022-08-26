"use strict";

const agent = require("./agent");

module.exports = {

	list() {
		return agent
			.get()
			.get("/api/tag")
			.then((response) => response.data);
	}

};
