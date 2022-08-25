"use strict";

const agent = require("./agent");

module.exports = {

	create(article) {
		return agent
			.get()
			.post("/api/article", { article })
			.then((response) => response.data);
	},

	get(slug) {
		return agent
			.get()
			.get(`/api/article/${slug}`)
			.then((response) => response.data);
	},

	favorite(slug) {
		return agent
			.get()
			.post(`/api/article/${slug}/favorite`)
			.then((response) => response.data);
	},

	unFavorite(slug) {
		return agent
			.get()
			.delete(`/api/article/${slug}/favorite`)
			.then((response) => response.data);
	}

};
