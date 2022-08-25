"use strict";

const PromiseRouter = require("express-promise-router");
const { validate } = require("express-validation");

const auth = require("../utils/auth");
const controller = require("./article.controller");
const schema = require("./article.schema");

const router = PromiseRouter();

router
	.route("/:slug")
	.get(controller.get)
	.put(controller.allowAuthorOnly, controller.update)
	.delete(controller.allowAuthorOnly, controller.remove);

router
	.route("/:slug/favorite")
	.post(controller.favorite)
	.delete(controller.unfavorite);

router
	.route("/:slug/comment")
	.get(controller.getComment)
	.post(controller.addComment);

router.delete("/:slug/comment/:id", controller.removeComment);

router.param(
	"slug",
	(req, res, next, id) => {
		// Authenticate the user before getting the article
		auth.optional(
			req,
			res,
			controller.getArticle.bind(null, req, res, next, id)
		);
	}
);

router
	.route("/")
	.get(
		auth.optional,
		validate(schema.list),
		controller.list
	)
	.post(
		auth,
		validate(schema.create),
		controller.create
	);

module.exports = router;
