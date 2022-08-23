import React from "react";
import Link from "next/link";
import autobind from "autobind-decorator";
import classnames from "classnames";
import Router, { withRouter } from "next/router";
import { connect } from "react-redux";

import api from "../api";
import { setUser } from "../features/user/userSlice";

@withRouter
@connect(
	(state) => ({
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
		const { pathname } = this.props.router;

		const accessToken = localStorage.getItem(process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY);

		if (accessToken) {
			try {
				const { user } = await api.user.me(accessToken);
				this.props.setUser({ user: user.name, accessToken: user.token });
				localStorage.setItem(process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY, user.token);
			} catch (error) {
				localStorage.removeItem(process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY);
			}
		} else {
			localStorage.removeItem(process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY);
			if (pathname !== "/" && pathname !== "/profile/[name]") {
				Router.replace("/");
			}
		}
	}

	@autobind
	renderNavbar() {
		const path = this.props.router.pathname;
		const { query } = this.props.router;
		const { brand } = this.state;
		const { user } = this.props;
		const userName = user.user;

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
							user.accessToken?.length > 0
								? (
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
								)
								: (
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
