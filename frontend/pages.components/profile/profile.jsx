import React from "react";
import Link from "next/link";
import moment from "moment";
import autobind from "autobind-decorator";
import Immutable from "immutable";
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
class Profile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			data: {},
			articles: [],
			count: 0,
			payload: this.getPayload()
		};
	}

	async componentDidMount() {
		await this.getProfile();
	}

	@autobind
	getPayload() {
		return {
			author: this.props.profileName,
			favorited: "",
			limit: 10,
			offset: 0
		};
	}

	@autobind
	async getProfile() {
		const name = this.props.profileName;
		const payload = Immutable.Map(this.state.payload).toJS();

		try {
			const [{ profile }, { articles, count }] = await Promise.all([
				api.profile.getProfile(name),
				api.article.list(payload),
			]);
			this.setState({ data: profile, articles, count, loading: false })
		} catch (error) {
			console.error(error);
			return window.alert(error?.message);
		}
	}

	@autobind
	async follow() {
		const name = this.props.profileName;

		try {
			const { profile } = await api.profile.follow(name);
			this.setState({ data: profile })
		} catch (error) {
			console.error(error);
			return window.alert(error?.message);
		}
	}

	@autobind
	async unFollow() {
		const name = this.props.profileName;

		try {
			const { profile } = await api.profile.unFollow(name);
			this.setState({ data: profile })
		} catch (error) {
			console.error(error);
			return window.alert(error?.message);
		}
	}

	render() {
		const { bio, following, image, name } = this.state.data;
		const { articles, payload } = this.state;
		const profileName = this.props.profileName;

		return (
			<>
				<NextSeo title="Profile" />

				<div className="profile-page">

					<div className="user-info">
						<div className="container">
							<div className="row">

								<div className="col-xs-12 col-md-10 offset-md-1">
									<img src={image} className="user-img" />
									<h4>{name}</h4>
									<p>{bio}</p>
									{
										profileName === this.props.user?.user ? (
											<button
												className="btn btn-sm btn-outline-secondary action-btn"
												onClick={() => Router.replace("/settings")}
											>
												<i className="ion-gear-a"></i>
												&nbsp;
												Edit Profile Settings
											</button>
										) : (
												<button
													className="btn btn-sm btn-outline-secondary action-btn"
													onClick={() => {
														if (!this.props.user.accessToken) {
															return Router.replace("/login");
														}

														if (following) {
															this.unFollow();
														} else {
															this.follow();
														}
													}}
												>
													<i className={classnames(
														following ? "ion-minus-round" : "ion-plus-round"
													)} />
													&nbsp;
													{following ? "Unfollow" : "Follow"} {name}
												</button>
											)
									}
								</div>

							</div>
						</div>
					</div>

					<div className="container">
						<div className="row">

							<div className="col-xs-12 col-md-10 offset-md-1">
								<div className="articles-toggle">
									<ul className="nav nav-pills outline-active">
										<li
											className="nav-item pointer"
											onClick={() => this.setState(
												Immutable
													.Map(this.state)
													.setIn(["payload", "author"], profileName)
													.setIn(["payload", "favorited"], "")
													.toJS()
												,
												this.getProfile
											)}
										>
											<a
												className={classnames(
													"nav-link",
													payload.author && "active"
												)}
											>
												My Articles
											</a>
										</li>
										<li
											className="nav-item pointer"
											onClick={() => this.setState(
												Immutable
													.Map(this.state)
													.setIn(["payload", "favorited"], profileName)
													.setIn(["payload", "author"], "")
													.toJS()
												,
												this.getProfile
											)}
										>
											<a
												className={classnames(
													"nav-link",
													payload.favorited && "active"
												)}
											>
												Favorited Articles
											</a>
										</li>
									</ul>
								</div>

								{
									articles.length > 0 && articles.map((row, index) => (
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
													<ul className="tag-list">
														{
															row?.tagList?.length > 0 && row.tagList.map((row, index) => (
																<li
																	className="tag-default tag-pill tag-outline"
																	key={index}
																>
																	{row}
																</li>
															))
														}
													</ul>

												</a>
											</Link>
										</div>
									))
								}

							</div>

						</div>
					</div>

				</div>
			</>
		);
	}

}

Profile.getInitialProps = function (context) {
	const query = context.query || {};
	const profileName = query.name;
	return { profileName };
};

export default Profile;
