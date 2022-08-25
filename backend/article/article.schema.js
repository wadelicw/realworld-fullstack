"use strict";

const { Joi } = require("express-validation");

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

const list = {
	params: Joi.object({
		tag: Joi.string(),
		author: Joi.string(),
		favorited: Joi.string(),
		followedBy: Joi.number(),
		offset: Joi
			.number()
			.description("Allows you to omit a specified number of pages before the beginning of the result set")
			.default(0),
		limit: Joi
			.number()
			.description("Allows you to limit the number of rows returned from a query")
			.default(20)
	})
};

module.exports = {
	create,
	list
};
