"use strict";

const Article = require("./article.model");
const logger = require("../utils/logger");

async function create(req, res) {
	const { user } = req;
	const payload = req.body.article;

	try {
		const article = await Article.create(
			payload.title,
			payload.description,
			payload.body,
			payload.tagList,
			user.id
		);

		return res.json({ article });
	} catch (error) {
		if (error.code === "ER_DUP_ENTRY") {
			return res
				.status(400)
				.json({
					message: "The article title has been used. Please enter another title."
				});
		}

		// Log the internal error for debugging
		logger.error(error, { label: "Article" });
		return res.status(500).json();
	}
}

function get(req, res) {
	return res.json({ article: req.article });
}

async function getArticle(req, res, next, slug) {
	const { user } = req;
	const article = await Article.getBySlug(slug, user?.id);

	if (!article) {
		return res
			.status(404)
			.json({
				message: `Article with slug ${slug} not found`
			});
	}

	req.article = article;
	return next();
}


async function favorite(req, res) {
	const { user } = req;
	let { article } = req;

	if (!user) {
		return res
			.status(403)
			.json({
				message: "Please login before favorite an article"
			});
	}

	article = await article.favorite(user.id);

	return res.json({ article });
}

async function unfavorite(req, res) {
	const { user } = req;
	let { article } = req;

	if (!user) {
		return res
			.status(403)
			.json({
				message: "Please login before unfavorite an article"
			});
	}

	article = await article.unfavorite(user.id);

	return res.json({ article });
}

module.exports = {
	create,
	get,
	getArticle,
	favorite,
	unfavorite
};
