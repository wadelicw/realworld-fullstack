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
	},

	update(slug, article) {
		return agent
			.get()
			.put(`/api/article/${slug}`, { article })
			.then((response) => response.data);
	},

	remove(slug) {
		return agent
			.get()
			.delete(`/api/article/${slug}`)
			.then((response) => response.data);
	},

	getComment(slug) {
		return agent
			.get()
			.get(`/api/article/${slug}/comment`)
			.then((response) => response.data);
	},

	addComment(slug, comment) {
		return agent
			.get()
			.post(`/api/article/${slug}/comment`, { comment })
			.then((response) => response.data);
	},

	removeComment(slug, id) {
		return agent
			.get()
			.delete(`/api/article/${slug}/comment/${id}`)
			.then((response) => response.data);
	},

	list(payload) {
		return agent
			.get()
			.get("/api/article", { params: payload })
			.then((response) => response.data);
	}

};
