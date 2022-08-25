"use strict";

const _ = require("lodash");
const flat = require("flat");
const slugify = require("slugify");
const knex = require("../utils/database");

function Article(body) {
	if (!(this instanceof Article)) {
		return new Article(body);
	}

	_.assign(this, body);
}

// Assign the dumpy value to userId if it isn't provided.
Article.findOne = async function (key, value, userId = "<NONE>") {
	const doc = await knex
		.select({
			// ID
			id: "article.ArticleId",
			// Article Content
			slug: "Slug",
			title: "Title",
			description: "Description",
			body: "Body",
			// Author Object
			"author.id": "article.UserId",
			"author.name": "author.Name",
			"author.bio": "author.Bio",
			"author.image": "author.Image",
			"author.following": knex.raw("IF(follow.UserId, 1, 0)"),
			"author.followingCount": knex
				.table({ follow: "UserFollow" })
				.count()
				.where("follow.NowFollowingUser", knex.raw("article.UserId")),
			// Tags
			tagList: knex
				.table({ tag: "ArticleTag" })
				.select(knex.raw("GROUP_CONCAT(tag)"))
				.where(knex.raw("tag.ArticleId = article.ArticleId")),
			// Favorite
			favorited: knex.raw("IF(favorited.UserId, 1, 0)"),
			favoritesCount: knex
				.table({ favorite: "ArticleFavorite" })
				.count()
				.where(knex.raw("favorite.ArticleId = article.ArticleId")),
			// Dates
			createdAt: "article.EnterDate",
			updatedAt: "article.LastUpdate"
		})
		.from(
			{ article: "Article" }
		)
		.leftJoin(
			{ author: "User" },
			"article.UserId",
			"author.UserId"
		)
		.leftJoin(
			{ favorited: "ArticleFavorite" },
			function () {
				this.on("favorited.ArticleId", "article.ArticleId");
				this.andOn("favorited.UserId", knex.raw("?", [userId]));
			}
		)
		.leftJoin(
			{ follow: "UserFollow" },
			function () {
				this.on("follow.NowFollowingUser", "article.UserId");
				this.andOn("follow.UserId", knex.raw("?", [userId]));
			}
		)
		.where(key, value)
		.then((articles) => articles.map((article) => {
			article["author.following"] = Boolean(article["author.following"]);
			article.tagList = article.tagList ? article.tagList.split(",") : [];
			const unflatted = flat.unflatten(article);
			return new this(unflatted);
		}))
		.then((articles) => articles[0]);

	if (doc) {
		return new this(doc);
	}

	return null;
};

Article.getById = function (articleId, userId) {
	return this.findOne("article.ArticleId", articleId, userId);
};

Article.getBySlug = function (slug, userId) {
	return this.findOne("article.Slug", slug, userId);
};

Article.create = async function (title, description, body, tagList, userId) {
	const slug = slugify(title).toLowerCase();

	const articleId = await knex
		.table("Article")
		.insert({
			title,
			slug,
			description,
			body,
			userId
		})
		.then((response) => response[0]); // Get the inserted article id

	if (tagList && tagList.length > 0) {
		await knex
			.table("ArticleTag")
			.insert(tagList.map((tag) => ({ ArticleId: articleId, Tag: tag })))
			.onConflict()
			.ignore();
	}

	return this.getById(articleId, userId);
};

Article.prototype.favorite = async function (userId) {
	await knex
		.table("ArticleFavorite")
		.insert({
			ArticleId: this.id,
			UserId: userId
		})
		.onConflict()
		.ignore();

	return Article.getById(this.id, userId);
};

Article.prototype.unfavorite = async function (userId) {
	await knex
		.table("ArticleFavorite")
		.where({
			ArticleId: this.id,
			UserId: userId
		})
		.delete();

	return Article.getById(this.id, userId);
};

module.exports = Article;
