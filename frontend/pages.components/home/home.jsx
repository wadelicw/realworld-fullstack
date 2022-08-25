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
class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			data: {},
			count: 0,
			payload: {
				tag: "",
				followedBy: "",
				limit: 10,
				offset: 0
			}
		};
	}

	async componentDidMount() {
		await this.listArticle();
	}

	async listArticle() {
		try {
			const payload = this.state.payload
			const { articles, count } = await api.article.list(payload);
			console.log(articles);
			this.setState({ data: articles, count, loading: false })
		} catch (error) {
			console.error(error);
			return window.alert(error?.message);
		}
	}

	render() {
		const { data, payload } = this.state;
		const { user } = this.props;

		return (
			<>
				<NextSeo title="Home" />
				<div className="home-page">

					<div className="banner">
						<div className="container">
							<h1 className="logo-font">conduit</h1>
							<p>A place to share your knowledge.</p>
						</div>
					</div>

					<div className="container page">
						<div className="row">

							<div className="col-md-9">
								<div className="feed-toggle">
									<ul className="nav nav-pills outline-active">
										<li className="nav-item">
											<a className="nav-link disabled" href="">Your Feed</a>
										</li>
										<li className="nav-item">
											<a className="nav-link active" href="">Global Feed</a>
										</li>
									</ul>
								</div>

								{
									data.length > 0 && data.map((row, index) => (
										<div className="article-preview" key={index}>
											<div className="article-meta">
												<Link href={`/profile/${row?.author?.name}`}>
													<a><img src={row?.author?.image} /></a>
												</Link>
												<div className="info">
													<Link href={`/profile/${row?.author?.name}`}>
														<a className="author">{row?.author?.name}</a>
													</Link>
													<span className="date">{moment(row?.updatedAt).format("MMMM Do")}</span>
												</div>
												<button className="btn btn-outline-primary btn-sm pull-xs-right">
													<i className="ion-heart" /> {row?.favoritesCount}
												</button>
											</div>
											<a href="" className="preview-link">
												<h1>{row?.title}</h1>
												<p>{row?.description}</p>
												<a>Read more...</a>
											</a>
										</div>
									))
								}

							</div>

							<div className="col-md-3">
								<div className="sidebar">
									<p>Popular Tags</p>

									<div className="tag-list">
										<a href="" className="tag-pill tag-default">programming</a>
										<a href="" className="tag-pill tag-default">javascript</a>
										<a href="" className="tag-pill tag-default">emberjs</a>
										<a href="" className="tag-pill tag-default">angularjs</a>
										<a href="" className="tag-pill tag-default">react</a>
										<a href="" className="tag-pill tag-default">mean</a>
										<a href="" className="tag-pill tag-default">node</a>
										<a href="" className="tag-pill tag-default">rails</a>
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

export default Home;
