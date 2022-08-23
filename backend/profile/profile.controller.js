"use strict";

const _ = require("lodash");
const User = require("../user/user.model");

async function getProfile(req, res) {
	const { user } = req;
	const { name } = req.params;

	const profile = await User.getByUsername(name);

	if (!profile) {
		return res
			.status(400)
			.json({
				message: `User ${name} is not found in database`
			});
	}

	const isFollowing = _.isNil(user) ? false : await profile.isFollowing(user.id);

	return res.send({
		profile: {
			name: profile.name,
			bio: profile.bio,
			image: profile.image,
			following: isFollowing
		}
	});
}

module.exports = {
	getProfile
};
