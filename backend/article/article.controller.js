"use strict";

const Article = require("./article.model");
const logger = require("../utils/logger");
const knex = require("../utils/database");

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

async function allowAuthorOnly(req, res, next) {
	const { user, article } = req;

	if (!user || user.id !== article.author.id) {
		return res
			.status(403)
			.json({
				message: "Only the author of the article can update or delete the article"
			});
	}

	return next();
}

async function update(req, res) {
	let { article } = req;
	const { user } = req;
	const paylaod = req.body.article;

	try {
		article = await article.update(
			paylaod.title,
			paylaod.description,
			paylaod.body,
			paylaod.tagList,
			user.id
		);
	} catch (error) {
		if (error.code === "ER_DUP_ENTRY") {
			return res
				.status(400)
				.json({
					message: "The article title has been used by another article"
				});
		}

		// Log the internal error for debugging
		logger.error(error, { label: "Article" });
		return res.status(500).json();
	}

	return res.json({ article });
}

async function remove(req, res) {
	const { article } = req;

	try {
		await article.remove();
		return res.json({});
	} catch (error) {
		// Log the internal error for debugging
		logger.error(error, { label: "Article" });
		return res.status(500).json();
	}
}

async function addComment(req, res) {
	const { user, article } = req;
	const payload = req.body.comment;

	if (!user) {
		return res
			.status(403)
			.send({
				message: "Please login before adding new comment"
			});
	}

	const comment = await article.addComment(payload, user.id);
	return res.json({ comment });
}

async function getComment(req, res) {
	const { article } = req;

	const ids = await knex
		.table("ArticleComment")
		.select({ id: "ArticleCommentId" })
		.where({ ArticleId: article.id })
		.then((comments) => comments.map((comment) => comment.id));

	const comments = await article.listComments(ids);

	return res.json({ comments });
}

async function removeComment(req, res) {
	const { id } = req.params;
	const { user, article } = req;

	const comment = await article.getComment(id);

	if (!comment) {
		return res
			.status(400)
			.json({
				message: "Invalid comment id"
			});
	}

	if (!user || user.id !== comment.author.id) {
		return res
			.status(403)
			.json({
				message: "You are not allowed to remove a comment that does not belong to you."
			});
	}

	await article.removeComment(id);

	return res.send();
}

module.exports = {
	create,
	get,
	getArticle,
	favorite,
	unfavorite,
	allowAuthorOnly,
	update,
	remove,
	addComment,
	getComment,
	removeComment
};
