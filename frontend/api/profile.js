"use strict";

const agent = require("./agent");

module.exports = {

	getProfile(name, accessToken) {
		return agent
			.get()
			.get(
				`/api/profile/${name}`,
				{ headers: { Authorization: `Bearer ${accessToken}` } }
			)
			.then((response) => response.data);
	},

	follow(name) {
		return agent
			.get()
			.post(`/api/profile/${name}/follow`)
			.then((response) => response.data);
	},

	unFollow(name) {
		return agent
			.get()
			.delete(`/api/profile/${name}/follow`)
			.then((response) => response.data);
	}

};
