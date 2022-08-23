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

	const isFollowing = user.id ? await profile.isFollowing(user.id) : false;

	return res.send({
		profile: {
			name: profile.name,
			bio: profile.bio,
			image: profile.image,
			following: isFollowing
		}
	});
}

function getProfileFieldsFromUser(user) {
	return _.pick(user, ["name", "bio", "image", "following"]);
}

async function follow(req, res) {
	const { user } = req;
	const { name } = req.params;

	if (user.name === name) {
		return res
			.status(400)
			.json({
				message: "You can't follow or unfollow yourself"
			});
	}

	let profile = await User.getByUsername(name);

	if (!profile) {
		return res
			.status(400)
			.json({
				message: `User ${name} is not found in database`
			});
	}

	await user.follow(profile.id);

	profile = await User
		.getById(profile.id)
		.then((newUser) => {
			newUser.following = true;
			return getProfileFieldsFromUser(newUser);
		});

	return res.send({ profile });
}

async function unFollow(req, res) {
	const { user } = req;
	const { name } = req.params;

	if (user.name === name) {
		return res
			.status(400)
			.json({ errors: { message: "You can't follow or unfollow yourself" } });
	}

	let profile = await User.getByUsername(name);

	if (!profile) {
		return res
			.status(400)
			.json({
				errors: {
					message: `User ${name} is not found in database`
				}
			});
	}

	await user.unFollow(profile.id);

	profile = await User
		.getById(profile.id)
		.then((newUser) => {
			newUser.following = false;
			return getProfileFieldsFromUser(newUser);
		});

	return res.send({ profile });
}

module.exports = {
	getProfile,
	follow,
	unFollow
};
