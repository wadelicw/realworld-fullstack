import React from "react";
import Router from "next/router";
import autobind from "autobind-decorator";
import Immutable from "immutable";
import { NextSeo } from "next-seo";
import { connect } from "react-redux";

import api from "../../api";
import { setUser } from "../../features/user/userSlice";

@connect(
	(state) => ({
		user: state.user
	}),
	{ setUser }
)
class Settings extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			payload: {
				email: "",
				name: "",
				bio: "",
				image: "",
				password: ""
			}
		};
	}

	async componentDidMount() {
		await this.getUser();
	}

	@autobind
	async getUser() {
		const accessToken = localStorage.getItem(process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY);

		if (!accessToken) {
			return Router.replace("/login");
		}

		try {
			const { user } = await api.user.me(accessToken);
			return this.setState({ loading: false, payload: { ...user, password: "" } });
		} catch (error) {
			console.error(error);
			return window.alert(error?.message);
		}
	}

	@autobind
	async update() {
		const payload = Immutable.Map(this.state.payload).toJS();

		if (payload.password.length < 1) {
			delete payload.password;
		}

		try {
			const { user } = await api.user.update(payload);
			window.alert("Success to update settings!");
			this.setState({ loading: false, payload: { ...user, password: "" } });
		} catch (error) {
			console.error(error);
			window.alert(error?.message);
		}
	}

	@autobind
	async logout() {
		this.props.setUser({ user: "", accessToken: "" });
		localStorage.removeItem(process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY);
		return Router.replace("/");
	}

	render() {
		const {
			email, name, bio, image, password
		} = this.state.payload;
		const { loading } = this.state;

		return (
			<>
				<NextSeo title="Settings" />

				{
					!loading && (
						<div className="settings-page">
							<div className="container page">
								<div className="row">

									<div className="col-md-6 offset-md-3 col-xs-12">
										<h1 className="text-xs-center">Your Settings</h1>

										<form>
											<fieldset>
												<fieldset className="form-group">
													<input
														className="form-control"
														type="text"
														placeholder="URL of profile picture"
														value={image}
														onChange={(event) => this.setState(
															Immutable
																.Map(this.state)
																.setIn(["payload", "image"], event.target.value)
																.toJS()
														)
														}
													/>
												</fieldset>
												<fieldset className="form-group">
													<input
														className="form-control form-control-lg"
														type="text"
														placeholder="Your Name"
														value={name}
														onChange={(event) => this.setState(
															Immutable
																.Map(this.state)
																.setIn(["payload", "name"], event.target.value)
																.toJS()
														)
														}
													/>
												</fieldset>
												<fieldset className="form-group">
													<textarea
														className="form-control form-control-lg"
														rows="8"
														placeholder="Short bio about you"
														value={bio}
														onChange={(event) => this.setState(
															Immutable
																.Map(this.state)
																.setIn(["payload", "bio"], event.target.value)
																.toJS()
														)
														}
													/>
												</fieldset>
												<fieldset className="form-group">
													<input
														className="form-control form-control-lg"
														type="text"
														placeholder="Email"
														value={email}
														onChange={(event) => this.setState(
															Immutable
																.Map(this.state)
																.setIn(["payload", "email"], event.target.value)
																.toJS()
														)
														}
													/>
												</fieldset>
												<fieldset className="form-group">
													<input
														className="form-control form-control-lg"
														type="password"
														placeholder="Password"
														value={password}
														onChange={(event) => this.setState(
															Immutable
																.Map(this.state)
																.setIn(["payload", "password"], event.target.value)
																.toJS()
														)
														}
													/>
												</fieldset>
												<button
													className="btn btn-lg btn-primary pull-xs-right"
													onClick={() => this.update()}
												>
													Update Settings
												</button>
											</fieldset>
										</form>

										<hr />

										<button
											className="btn btn-outline-danger"
											onClick={() => this.logout()}
										>
											Or click here to logout.
										</button>
									</div>

								</div>
							</div>
						</div>
					)
				}
			</>
		);
	}
}

export default Settings;
