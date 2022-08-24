import React from "react";
import Router from "next/router";
import autobind from "autobind-decorator";
import Immutable from "immutable";
import { NextSeo } from "next-seo";

import api from "../../api";

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
			}
		};
	}

	@autobind
	async create() {
		try {
			const { article } = await api.article.create(this.state.payload);
			console.log(article);
			window.alert("Success to create article!");
			this.setState({ loading: false });
		} catch (error) {
			console.error(error);
			return window.alert(error?.message);
		}
	}

	render() {
		const { title, description, body, tagList } = this.state.payload;

		return (
			<>
				<NextSeo title="Settings" />

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
												onChange={(event) =>
													this.setState(
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
												onChange={(event) =>
													this.setState(
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
												onChange={(event) =>
													this.setState(
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
														this.setState(
															Immutable
																.Map(this.state)
																.updateIn(
																	["payload", "tagList"],
																	(array) => {
																		array.push(event.target.value);
																		return array;
																	}
																)
																.toJS()
														);

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
																			(array) => array.filter((item) => item !== row)
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
											onClick={() => this.create()}
										>
											Publish Article
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

export default Editor;
