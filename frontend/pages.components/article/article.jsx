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
			this.setState({ data: article })
		} catch (error) {
			console.error(error);
			return window.alert(error?.message);
		}
	}

	render() {
		const { author, title, body, updatedAt } = this.state.data;
		const { slug, user } = this.props;
		console.log(slug, user);
		return (
			<>
				<NextSeo title="Article" />

				<div className="article-page">

					<div className="banner">
						<div className="container">

							<h1>{title}</h1>

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
								<button className="btn btn-sm btn-outline-secondary">
									<i className="ion-plus-round"></i>
									&nbsp;
									Follow Eric Simons <span className="counter">(10)</span>
								</button>
								&nbsp;&nbsp;
								<button className="btn btn-sm btn-outline-primary">
									<i className="ion-heart"></i>
									&nbsp;
									Favorite Post <span className="counter">(29)</span>
								</button>
							</div>

						</div>
					</div>

					<div className="container page">

						<div className="row article-content">
							<div className="col-md-12">
								<p>{body}</p>
							</div>
						</div>

						<hr />

						<div className="article-actions">
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
								<button className="btn btn-sm btn-outline-secondary">
									<i className="ion-plus-round"></i>
									&nbsp;
									Follow Eric Simons <span className="counter">(10)</span>
								</button>
								&nbsp;&nbsp;
								<button className="btn btn-sm btn-outline-primary">
									<i className="ion-heart"></i>
									&nbsp;
									Favorite Post <span className="counter">(29)</span>
								</button>
							</div>
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
