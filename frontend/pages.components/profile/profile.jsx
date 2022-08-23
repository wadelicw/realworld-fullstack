import React from "react";
import autobind from "autobind-decorator";
import classnames from "classnames";
import { NextSeo } from "next-seo";
import { connect } from "react-redux";
import { withRouter } from "next/router";

import api from "../../api";

@withRouter
@connect(
	state => ({
		user: state.user
	})
)
class Profile extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			data: {}
		};
	}

	async componentDidMount() {
		await this.getProfile();
	}

	@autobind
	async getProfile() {
		const name = this.props.router?.query?.name;

		try {
			const { profile } = await api.profile.getProfile(name);
			this.setState({ data: profile })
		} catch (error) {
			console.error(error);
			return window.alert(error?.message);
		}
	}

	@autobind
	async follow() {
		const name = this.props.router?.query?.name;

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
		const name = this.props.router?.query?.name;

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
		const profileName = this.props.router?.query?.name;

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
											<button className="btn btn-sm btn-outline-secondary action-btn">
												<i className="ion-gear-a"></i>
												&nbsp;
												Edit Profile Settings
											</button>
										) : (
												<button
													className="btn btn-sm btn-outline-secondary action-btn"
													onClick={() => {
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
										<li className="nav-item">
											<a className="nav-link active" href="">My Articles</a>
										</li>
										<li className="nav-item">
											<a className="nav-link" href="">Favorited Articles</a>
										</li>
									</ul>
								</div>

								<div className="article-preview">
									<div className="article-meta">
										<a href=""><img src="http://i.imgur.com/Qr71crq.jpg" /></a>
										<div className="info">
											<a href="" className="author">Eric Simons</a>
											<span className="date">January 20th</span>
										</div>
										<button className="btn btn-outline-primary btn-sm pull-xs-right">
											<i className="ion-heart"></i> 29
										</button>
									</div>
									<a href="" className="preview-link">
										<h1>How to build webapps that scale</h1>
										<p>This is the description for the post.</p>
										<span>Read more...</span>
									</a>
								</div>

								<div className="article-preview">
									<div className="article-meta">
										<a href=""><img src="http://i.imgur.com/N4VcUeJ.jpg" /></a>
										<div className="info">
											<a href="" className="author">Albert Pai</a>
											<span className="date">January 20th</span>
										</div>
										<button className="btn btn-outline-primary btn-sm pull-xs-right">
											<i className="ion-heart"></i> 32
										</button>
									</div>
									<a href="" className="preview-link">
										<h1>The song you won't ever stop singing. No matter how hard you try.</h1>
										<p>This is the description for the post.</p>
										<span>Read more...</span>
										<ul className="tag-list">
											<li className="tag-default tag-pill tag-outline">Music</li>
											<li className="tag-default tag-pill tag-outline">Song</li>
										</ul>
									</a>
								</div>


							</div>

						</div>
					</div>

				</div>
			</>
		);
	}

}

export default Profile;
