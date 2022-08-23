"use strict";

const { Joi } = require("express-validation");

const getProfile = {
	params: Joi.object({
		name: Joi.string().description("The name of the user")
	})
};

module.exports = {
	getProfile
};
