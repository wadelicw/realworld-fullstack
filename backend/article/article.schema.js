"use strict";

const Joi = require("joi");

const article = Joi.object({
	title: Joi
		.string()
		.description("The title of the article")
		.required(),
	description: Joi
		.string()
		.description("A brief summary of the article")
		.required(),
	body: Joi
		.string()
		.description("The content of the article")
		.required()
});

const create = {
	body: Joi.object({
		article: article
			.keys({ tagList: Joi.array().items(Joi.string()) })
			.required()
	})
};

module.exports = {
	create
};
