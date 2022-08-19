import React from "react";
import autobind from "autobind-decorator";
import classnames from "classnames";
import { withRouter } from "next/router";

@withRouter
class Main extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			path: this.props.router.pathname
		};
	}

	@autobind
	renderNavbar() {

		const { path } = this.state;

		return (
			<nav className="navbar navbar-light">
				<div className="container">
					<a className="navbar-brand" href="/">conduit</a>
					<ul className="nav navbar-nav pull-xs-right">
						<li className="nav-item">
							<a
								className={classnames(
									"nav-link",
									path === "/" ? "active" : undefined
								)}
								href="/"
							>
								Home
							</a>
						</li>
						<li className="nav-item">
							<a className="nav-link" href="">
								<i className="ion-compose"></i>&nbsp;New Article
                        	</a>
						</li>
						<li className="nav-item">
							<a className="nav-link" href="">
								<i className="ion-gear-a"></i>&nbsp;Settings
                        	</a>
						</li>
						<li className="nav-item">
							<a
								className={classnames(
									"nav-link",
									path === "/login" ? "active" : undefined
								)}
								href="/login"
							>
								Sign in
							</a>
						</li>
						<li className="nav-item">
							<a
								className={classnames(
									"nav-link",
									path === "/register" ? "active" : undefined
								)}
								href="/register"
							>
								Sign up
							</a>
						</li>
					</ul>
				</div>
			</nav>
		);
	}

	@autobind
	renderFooter() {
		return (
			<footer>
				<div className="container">
					<a href="/" className="logo-font">conduit</a>
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
