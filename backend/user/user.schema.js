"use strict";

const { Joi } = require("express-validation");

const email = Joi
	.string()
	.email()
	.description("The email address of the user")
	.required();

const password = Joi
	.string()
	.min(3)
	.required();

const name = Joi
	.string()
	.description("The name of the user")
	.min(3)
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

const update = {
	body: Joi.object({
		user: Joi
			.object({
				name: name,
				email: email,
				bio: Joi
					.string()
					.description("A short description about the user"),
				image: Joi
					.string()
					.description("Image URL which is used to display on the website"),
				token: Joi
					.string()
					.description("Unique token string generated by the API call"),
				// Optional update
				password: Joi
					.string()
					.min(3)
			})
	})
};

module.exports = {
	login,
	register,
	update
};
