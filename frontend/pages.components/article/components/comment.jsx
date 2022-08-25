import React from "react";
import Link from "next/link";
import moment from "moment";
import autobind from "autobind-decorator";
import Immutable from "immutable";

import api from "../../../api";

class Comment extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			payload: {
				body: ""
			}
		};
	}

	async componentDidMount() {
		await this.getComment();
	}

	@autobind
	async getComment() {
		const { slug } = this.props;

		try {
			const { comments } = await api.article.getComment(slug);
			this.setState({ data: comments })
		} catch (error) {
			console.error(error);
			return window.alert(error?.message);
		}
	}

	@autobind
	async addComment() {
		const { slug } = this.props;
		const { body } = this.state.payload;

		try {
			await api.article.addComment(slug, body);
			return this.getComment();
		} catch (error) {
			console.error(error);
			return window.alert(error?.message);
		}
	}

	@autobind
	async removeComment(id) {
		const { slug } = this.props;
		try {
			await api.article.removeComment(slug, id);
			return this.getComment();
		} catch (error) {
			console.error(error);
			return window.alert(error?.message);
		}
	}

	render() {
		const { data, payload } = this.state;
		const { user } = this.props;

		return (
			<div className="row">

				<div className="col-xs-12 col-md-8 offset-md-2">

					{
						user.accessToken
							? (
								<form className="card comment-form">
									<div className="card-block">
										<textarea
											className="form-control"
											placeholder="Write a comment..."
											rows="3"
											value={payload.body}
											onChange={event =>
												this.setState(
													Immutable
														.Map(this.state)
														.setIn(["payload", "body"], event.target.value)
														.toJS()
												)
											}
										/>
									</div>
									<div className="card-footer">
										<span>{user.user}</span>
										<button
											className="btn btn-sm btn-primary"
											onClick={() => this.addComment()}
										>
											Post Comment
										</button>
									</div>
								</form>
							)
							: (
								<p>
									<Link href="/login">
										<a>Sign in</a>
									</Link>
									&nbsp;or&nbsp;
									<Link href="/register">
										<a>sign up</a>
									</Link>
									&nbsp;
									to add comments on this article.
								</p>
							)
					}

					{
						data.length > 0 && data.map((row, index) => (
							<div className="card" key={index}>
								<div className="card-block">
									<p className="card-text">{row?.body}</p>
								</div>
								<div className="card-footer">
									<Link href={`/profile/${row?.author?.name}`}>
										<a className="comment-author">
											<img src={row?.author?.image} className="comment-author-img" />
										</a>
									</Link>
									&nbsp;
									<Link href={`/profile/${row?.author?.name}`}>
										<a className="comment-author">{row?.author?.name}</a>
									</Link>
									<span className="date-posted">{moment(row?.updatedAt).format("MMMM Do")}</span>
									{
										user.user === row?.author?.name && (
											<span className="mod-options">
												<i
													className="ion-trash-a"
													onClick={() => this.removeComment(row.id)}
												/>
											</span>
										)
									}
								</div>
							</div>
						))
					}

				</div>

			</div>
		);
	}

}

export default Comment;
