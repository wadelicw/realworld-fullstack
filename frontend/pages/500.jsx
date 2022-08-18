import React from "react";
import { NextSeo } from "next-seo";
import webConfig from "../web.config";

export default () => {
	return (
		<>
			<NextSeo title="Internal Server Error" />
			<div className="container">
				<div className="error-page-container">
					<div>
						<h3>Internal Server Error</h3>
						<p>The server encountered an internal error or misconfiguration and was unable to complete your request. {`\n\n`} Please contact the server administrator and inform them of the time the error occurred and anything you might have done that may have caused the error. {`\n`} More information about this error may be available in the server error log.</p>
						<p>Click <a href="/">here</a> to go to {webConfig.title}'s home page</p>
					</div>
				</div>
			</div>
		</>
	);
}
