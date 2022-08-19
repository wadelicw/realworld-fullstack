import React from "react";
import classnames from "classnames";
import { withRouter } from "next/router";

@withRouter
class Navbar extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			path: this.props.router.pathname
		};
	}

	render() {

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

}

export default Navbar;
