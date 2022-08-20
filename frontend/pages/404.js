import React from "react";
import Link from "next/link";
import { NextSeo } from "next-seo";
import webConfig from "../web.config";

export default function NotFoundPage() {
	return (
		<>
			<NextSeo title="Page Not Found" />
			<div className="container">
				<div className="error-page-container">
					<div>
						<h3>Not Found</h3>
						<p>This page could not be found</p>
						<p>Click <Link href="/"><a>here</a></Link> to go to {webConfig.title} &apos;s home page</p>
					</div>
				</div>
			</div>
		</>
	);
}
