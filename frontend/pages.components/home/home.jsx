import React from "react";
import Link from "next/link";
import moment from "moment";
import autobind from "autobind-decorator";
import Immutable from "immutable";
import classnames from "classnames";
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
			tags: [],
			data: [],
			count: 0,
			payload: this.getPayload()
		};
	}

	async componentDidMount() {
		await this.listArticle();
	}

	@autobind
	getPayload() {
		return {
			tag: "",
			followedBy: "",
			limit: 10,
			offset: 0
		};
	}

	@autobind
	async listArticle() {
		try {
			const payload = this.state.payload;
			const [{ articles, count }, { tags }] = await Promise.all([
				api.article.list(payload),
				api.tag.list()
			]);
			this.setState({ data: articles, count, tags, loading: false });
		} catch (error) {
			console.error(error);
			return window.alert(error?.message);
		}
	}

	render() {
		const { data, tags, payload } = this.state;
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
										<li
											className="nav-item pointer"
											onClick={() => this.setState(
												Immutable
													.Map(this.state)
													.setIn(["payload", "followedBy"], user?.user)
													.setIn(["payload", "tag"], "")
													.toJS()
												,
												this.listArticle
											)}
										>
											<a
												className={classnames(
													"nav-link",
													!user.accessToken && "disabled",
													payload.followedBy && "active"
												)}
											>
												Your Feed
											</a>
										</li>
										<li
											className="nav-item pointer"
											onClick={() =>
												this.setState(
													{ payload: this.getPayload() },
													this.listArticle
												)}
										>
											<a className={classnames(
												"nav-link",
												!payload.tag && !payload.followedBy && "active"
											)} >
												Global Feed
											</a>
										</li>
										{
											payload.tag && (
												<li className="nav-item">
													<a className="nav-link active" href="">
														<i className="ion-pound" />
														{payload.tag}
													</a>
												</li>
											)
										}
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
											<Link href={`/article/${row?.slug}`}>
												<a className="preview-link">
													<h1>{row?.title}</h1>
													<p>{row?.description}</p>
													<p>Read more...</p>
												</a>
											</Link>
										</div>
									))
								}

							</div>

							<div className="col-md-3">
								<div className="sidebar">
									<p>Popular Tags</p>

									<div className="tag-list">
										{
											tags.length > 0 && tags.map((row, index) => (
												<a
													className="tag-pill tag-default pointer"
													key={index}
													onClick={() => this.setState(
														Immutable
															.Map(this.state)
															.setIn(["payload", "tag"], row)
															.toJS()
														,
														this.listArticle
													)}
												>
													{row}
												</a>
											))
										}
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
