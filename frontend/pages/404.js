import React from "react";
import { NextSeo } from "next-seo";
import webConfig from "../web.config";

export default () => {
	return (
		<>
			<NextSeo title="Page Not Found" />
			<div className="container">
				<div className="error-page-container">
					<div>
						<h3>Not Found</h3>
						<p>This page could not be found</p>
						<p>Click <a href="/">here</a> to go to {webConfig.title}'s home page</p>
					</div>
				</div>
			</div>
		</>
	);
}
