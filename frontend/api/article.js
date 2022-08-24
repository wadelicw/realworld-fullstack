"use strict";

const agent = require("./agent");

module.exports = {

	create(article) {
		return agent
			.get()
			.post("/api/article", { article })
			.then((response) => response.data);
	}

};
