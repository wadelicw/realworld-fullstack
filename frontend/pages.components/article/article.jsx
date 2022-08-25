import React from "react";
import Link from "next/link";
import moment from "moment";
import autobind from "autobind-decorator";
import classnames from "classnames";
import Router from "next/router";
import { NextSeo } from "next-seo";
import { connect } from "react-redux";

import api from "../../api";

@connect(
	state => ({
		user: state.user
	})
)
class Article extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			data: {}
		};
	}

	async componentDidMount() {
		await this.getArticle();
	}

	@autobind
	async getArticle() {
		try {
			const slug = this.props.slug;
			const { article } = await api.article.get(slug);
			console.log(article)
			this.setState({ data: article, loading: false })
		} catch (error) {
			console.error(error);
			return window.alert(error?.message);
		}
	}

	@autobind
	async follow(name) {
		this.setState({ loading: true });
		try {
			await api.profile.follow(name);
			return this.getArticle();
		} catch (error) {
			console.error(error);
			return window.alert(error?.message);
		}
	}

	@autobind
	async unFollow(name) {
		this.setState({ loading: true });
		try {
			await api.profile.unFollow(name);
			return this.getArticle();
		} catch (error) {
			console.error(error);
			return window.alert(error?.message);
		}
	}

	@autobind
	async favorite(slug) {
		this.setState({ loading: true });
		try {
			await api.article.favorite(slug);
			return this.getArticle();
		} catch (error) {
			console.error(error);
			return window.alert(error?.message);
		}
	}

	@autobind
	async unFavorite(slug) {
		this.setState({ loading: true });
		try {
			await api.article.unFavorite(slug);
			return this.getArticle();
		} catch (error) {
			console.error(error);
			return window.alert(error?.message);
		}
	}

	@autobind
	async remove(slug) {
		try {
			if (window.confirm("Are you sure to remove this article?")) {
				await api.article.remove(slug);
				return Router.replace("/");
			}
			return;
		} catch (error) {
			console.error(error);
			return window.alert(error?.message);
		}
	}

	@autobind
	renderAuthorDetail() {
		const {
			author, updatedAt, favorited, favoritesCount
		} = this.state.data;
		const { slug, user } = this.props;

		return (
			<div className="article-meta">
				<Link href={`/profile/${author?.name}`}>
					<a><img src={author?.image} /></a>
				</Link>
				<div className="info">
					<Link href={`/profile/${author?.name}`}>
						<a className="author">{author?.name}</a>
					</Link>
					<span className="date">{moment(updatedAt).format("MMMM Do")}</span>
				</div>
				{
					user.user !== author?.name
						? (
							<>
								<button
									className="btn btn-sm btn-outline-secondary"
									onClick={() => {
										if (!user.accessToken) {
											return Router.replace("/login");
										}

										if (author?.following) {
											this.unFollow(author?.name);
										} else {
											this.follow(author?.name);
										}
									}}
								>
									<i className={classnames(
										author?.following ? "ion-minus-round" : "ion-plus-round"
									)} />
									&nbsp;
									{author?.following ? "Unfollow" : "Follow"} {author?.name} <span className="counter">({author?.followingCount})</span>
								</button>
								&nbsp;&nbsp;
								<button
									className="btn btn-sm btn-outline-primary"
									onClick={() => {
										if (!user.accessToken) {
											return Router.replace("/login");
										}

										if (favorited) {
											this.unFavorite(slug);
										} else {
											this.favorite(slug);
										}
									}}
								>
									<i className="ion-heart" />
									&nbsp;
									{favorited ? "Unfavorite" : "Favorite"} Post <span className="counter">({favoritesCount})</span>
								</button>
							</>
						)
						: (
							<>
								<button
									className="btn btn-sm btn-outline-secondary"
									onClick={() => Router.replace(`/editor/${slug}`)}
								>
									<i className="ion-edit" />
									&nbsp;
									Edit Article
								</button>
								&nbsp;&nbsp;
								<button
									className="btn btn-sm btn-outline-danger"
									onClick={() => this.remove(slug)}
								>
									<i className="ion-trash-a" />
									&nbsp;
									Delete Article
								</button>
							</>
						)
				}
			</div>
		);
	}

	render() {
		const {
			author, title, body, updatedAt, tagList,
			favorited, favoritesCount
		} = this.state.data;
		const { slug, user } = this.props;
		return (
			<>
				<NextSeo title="Article" />

				<div className="article-page">

					<div className="banner">
						<div className="container">

							<h1>{title}</h1>
							<this.renderAuthorDetail user={user} />

						</div>
					</div>

					<div className="container page">

						<div className="row article-content">
							<div className="col-md-12">
								<p>{body}</p>
								<div className="tag-list">
									<ul style={{ padding: 0 }}>
										{
											tagList?.map((row, index) => (
												<li
													key={index}
													className="tag-default tag-pill tag-outline ng-binding ng-scope"
												>
													{row}
												</li>
											))
										}
									</ul>
								</div>
							</div>
						</div>

						<hr />

						<div className="article-actions">
							<this.renderAuthorDetail />
						</div>

						<div className="row">

							<div className="col-xs-12 col-md-8 offset-md-2">

								<form className="card comment-form">
									<div className="card-block">
										<textarea className="form-control" placeholder="Write a comment..." rows="3"></textarea>
									</div>
									<div className="card-footer">
										<img src="http://i.imgur.com/Qr71crq.jpg" className="comment-author-img" />
										<button className="btn btn-sm btn-primary">
											Post Comment
										</button>
									</div>
								</form>

								<div className="card">
									<div className="card-block">
										<p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
									</div>
									<div className="card-footer">
										<a href="" className="comment-author">
											<img src="http://i.imgur.com/Qr71crq.jpg" className="comment-author-img" />
										</a>
										&nbsp;
										<a href="" className="comment-author">Jacob Schmidt</a>
										<span className="date-posted">Dec 29th</span>
									</div>
								</div>

								<div className="card">
									<div className="card-block">
										<p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
									</div>
									<div className="card-footer">
										<a href="" className="comment-author">
											<img src="http://i.imgur.com/Qr71crq.jpg" className="comment-author-img" />
										</a>
										&nbsp;
										<a href="" className="comment-author">Jacob Schmidt</a>
										<span className="date-posted">Dec 29th</span>
										<span className="mod-options">
											<i className="ion-edit"></i>
											<i className="ion-trash-a"></i>
										</span>
									</div>
								</div>

							</div>

						</div>

					</div>

				</div>
			</>
		);
	}

}

Article.getInitialProps = function (context) {
	const query = context.query || {};
	const slug = query.slug;
	return { slug };
};

export default Article;
