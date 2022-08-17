"use strict";

const { Joi } = require("express-validation");

const email = Joi
	.string()
	.email()
	.description("The email address of the user")
	.required();

const password = Joi
	.string()
	.min(4)
	.required();

const name = Joi
	.string()
	.description("The name of the user")
	.min(4)
	.max(64)
	.required();

const login = {
	body: Joi.object({
		user: Joi
			.object({
				email: email,
				password: password
			})
			.required()
	})
};

const register = {
	body: Joi.object({
		user: Joi
			.object({
				name: name,
				email: email,
				password: password
			})
			.required()
	})
};

module.exports = {
	login,
	register
};
