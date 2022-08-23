import React from "react";
import Link from "next/link";
import Router from "next/router";
import autobind from "autobind-decorator";
import classnames from "classnames";
import { connect } from "react-redux";
import { withRouter } from "next/router";

import api from "../api";
import { setUser } from "../features/user/userSlice";

@withRouter
@connect(
	state => ({
		user: state.user
	}),
	{ setUser }
)
class Main extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			brand: "conduit"
		};
	}

	async componentDidMount() {

		const pathname = this.props.router.pathname;

		/**
		 *
		 * Check if access token is stored in local storage
		 * If Exist, try to login
		 *
		 */
		let accessToken = localStorage.getItem(process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY);

		if (accessToken) {
			try {
				const { user } = await api.user.me(accessToken);
				this.props.setUser({ user: user.name, accessToken: user.token });
				localStorage.setItem(process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY, user.token);
				return console.log("Validated User: ", user.name);
			} catch (error) {
				console.error(error);
				/**
				 *
				 * Remove the local storage access token
				 *
				 */
				localStorage.removeItem(process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY);
			}
		}

		/**
		 *
		 * All else failed
		 *
		 */
		localStorage.removeItem(process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY);

		if (pathname != "/")
			await Router.replace("/");

	}

	@autobind
	renderNavbar() {
		const path = this.props.router.pathname;
		const { brand } = this.state;
		const user = this.props.user;
		const userName = user.user;
		const query = this.props.router.query

		return (
			<nav className="navbar navbar-light">
				<div className="container">
					<Link href="/">
						<a className="navbar-brand">{brand}</a>
					</Link>
					<ul className="nav navbar-nav pull-xs-right">
						<li className="nav-item">
							<Link href="/">
								<a
									className={classnames(
										"nav-link",
										path === "/" ? "active" : undefined
									)}
								>
									Home
								</a>
							</Link>
						</li>
						<li className="nav-item">
							<Link href="">
								<a className="nav-link" >
									<i className="ion-compose"></i>&nbsp;New Article
								</a>
							</Link>
						</li>
						<li className="nav-item">
							<Link href="">
								<a className="nav-link">
									<i className="ion-gear-a"></i>&nbsp;Settings
								</a>
							</Link>
						</li>
						{
							user.accessToken?.length > 0 ? (
								<li className="nav-item">
									<Link href={`/profile/${userName}`}>
										<a
											className={classnames(
												"nav-link",
												query.name === userName ? "active" : undefined
											)}
										>
											{userName}
										</a>
									</Link>
								</li>
							) : (
									<>
										<li className="nav-item">
											<Link href="/login">
												<a
													className={classnames(
														"nav-link",
														path === "/login" ? "active" : undefined
													)}
												>
													Sign in
												</a>
											</Link>
										</li>
										<li className="nav-item">
											<Link href="/register">
												<a
													className={classnames(
														"nav-link",
														path === "/register" ? "active" : undefined
													)}
												>
													Sign up
												</a>
											</Link>
										</li>
									</>
								)
						}
					</ul>
				</div>
			</nav>
		);
	}

	@autobind
	renderFooter() {
		const { brand } = this.state;

		return (
			<footer>
				<div className="container">
					<Link href="/">
						<a className="logo-font">{brand}</a>
					</Link>
					<span className="attribution">
						An interactive learning project from <a href="https://thinkster.io">Thinkster</a>. Code &amp; design licensed under MIT.
					</span>
				</div>
			</footer>
		);
	}

	render() {
		return (
			<>
				<this.renderNavbar />
				{this.props.children}
				<this.renderFooter />
			</>
		);
	}
}

export default Main;
