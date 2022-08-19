"use strict";

const _ = require("lodash");
const User = require("./user.model");
const logger = require("../utils/logger");

function getMe(req, res) {
	const { user } = req;
	user.token = user.generateJWTToken();

	return res.json({ user: _.pick(user, ["email", "token", "name", "bio", "image"]) });
}

async function login(req, res) {
	const payload = req.body.user;

	const user = await User.getByEmail(payload.email);

	if (!user) {
		return res
			.status(400)
			.json({
				message: "User not found."
			});
	}

	const isValid = await user.validate(payload.password);

	if (!isValid) {
		return res
			.status(401)
			.json({
				message: "Password not match"
			});
	}

	req.user = user;

	return getMe(req, res);
}

async function register(req, res) {
	const payload = req.body.user;

	try {
		const user = await User.register(
			payload.email,
			payload.name,
			payload.password
		);

		logger.info(`User #${user.id} with email address ${payload.email} registered`, { label: "User" });

		req.user = user;
		return getMe(req, res);
	} catch (error) {
		if (error.code === "ER_DUP_ENTRY") {
			return res
				.status(400)
				.json({
					message: "The email or username has been taken already. Please choose another username or email.",
					code: "ER_DUP_ENTRY"
				});
		}

		logger.error(error, { label: "User" });
		return res.status(500).send();
	}
}

async function update(req, res) {
	const payload = req.body.user;
	let { user } = req;

	try {
		// The User.update function will return the new user document after update
		user = await user.update(payload);

		req.user = user;
		return getMe(req, res);
	} catch (error) {
		if (error.code === "ER_DUP_ENTRY") {
			return res
				.status(400)
				.json({
					message: "The email or username has been taken already. Please choose another username or email.",
					code: "ER_DUP_ENTRY"
				});
		}

		// Log the internal error for debugging
		logger.error(error, { label: "User" });
		return res.status(500).send();
	}
}

module.exports = {
	login,
	register,
	getMe,
	update
};
