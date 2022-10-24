import React from "react";
import Router from "next/router";
import autobind from "autobind-decorator";
import Immutable from "immutable";
import { NextSeo } from "next-seo";
import { connect } from "react-redux";

import api from "../../api";

@connect(
	(state) => ({
		user: state.user
	})
)
class Editor extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			payload: {
				title: "",
				description: "",
				body: "",
				tagList: []
			},
			data: {}
		};
	}

	async componentDidMount() {
		if (this.props.slug) {
			await this.getArticle();
		}
	}

	@autobind
	async getArticle() {
		try {
			const { slug } = this.props;
			const { article } = await api.article.get(slug);
			this.setState({
				payload: {
					title: article.title,
					description: article.description,
					body: article.body,
					tagList: article.tagList
				},
				data: article,
				loading: false
			});
		} catch (error) {
			console.error(error);
			window.alert(error?.message);
		}
	}

	@autobind
	async create() {
		try {
			const { article } = await api.article.create(this.state.payload);
			return Router.replace(`/article/${article.slug}`);
		} catch (error) {
			console.error(error);
			return window.alert(error?.message);
		}
	}

	@autobind
	async update(user) {
		try {
			const { data } = this.state;

			if (data.author?.name !== user.user) {
				window.alert("Only the author of the article can update the article");
				return Router.replace("/");
			}

			await api.article.update(data.slug, this.state.payload);
			return Router.replace(`/article/${data.slug}`);
		} catch (error) {
			console.error(error);
			return window.alert(error?.message);
		}
	}

	render() {
		const {
			title, description, body, tagList
		} = this.state.payload;
		const { slug, user } = this.props;

		return (
			<>
				<NextSeo title="Editor" />

				<div className="editor-page">
					<div className="container page">
						<div className="row">

							<div className="col-md-10 offset-md-1 col-xs-12">
								<form>
									<fieldset>
										<fieldset className="form-group">
											<input
												type="text"
												className="form-control form-control-lg"
												placeholder="Article Title"
												value={title}
												onChange={(event) => this.setState(
													Immutable
														.Map(this.state)
														.setIn(["payload", "title"], event.target.value)
														.toJS()
												)
												}
											/>
										</fieldset>
										<fieldset className="form-group">
											<input
												type="text"
												className="form-control"
												placeholder="What's this article about?"
												value={description}
												onChange={(event) => this.setState(
													Immutable
														.Map(this.state)
														.setIn(["payload", "description"], event.target.value)
														.toJS()
												)
												}
											/>
										</fieldset>
										<fieldset className="form-group">
											<textarea
												className="form-control"
												rows="8"
												placeholder="Write your article (in markdown)"
												value={body}
												onChange={(event) => this.setState(
													Immutable
														.Map(this.state)
														.setIn(["payload", "body"], event.target.value)
														.toJS()
												)
												}
											/>
										</fieldset>
										<fieldset className="form-group">
											<input
												type="text"
												className="form-control"
												placeholder="Enter tags"
												onKeyPress={(event) => {
													if (event.key === "Enter") {
														this.setState(Immutable
															.Map(this.state)
															.updateIn(
																["payload", "tagList"],
																(array) => {
																	array.push(event.target.value);
																	return array;
																}
															)
															.toJS());
														event.target.value = "";
													}
												}}
											/>
											<div className="tag-list">
												{
													tagList.map((row, index) => (
														<span
															key={index}
															className="tag-default tag-pill ng-binding ng-scope"
														>
															<i
																className="ion-close-round"
																onClick={() => this.setState(
																	Immutable
																		.Map(this.state)
																		.updateIn(
																			["payload", "tagList"],
																			(array) => array
																				.filter(
																					(item) => item !== row
																				)
																		)
																		.toJS()
																)}
															/>
															{row}
														</span>
													))
												}
											</div>
										</fieldset>
										<button
											className="btn btn-lg pull-xs-right btn-primary"
											type="button"
											onClick={() => (slug ? this.update(user) : this.create())}
										>
											{slug ? "Update" : "Publish"} Article
										</button>
									</fieldset>
								</form>
							</div>

						</div>
					</div>
				</div>
			</>
		);
	}
}

Editor.getInitialProps = function (context) {
	const query = context.query || {};
	const { slug } = query;
	return { slug };
};

export default Editor;
