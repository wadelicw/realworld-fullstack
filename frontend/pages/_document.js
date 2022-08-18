import React from "react";
import NextDocument, {
	Html, Head, Main, NextScript
} from "next/document";

class Document extends NextDocument {

	render() {
		return (
			<Html lang="en">
				<Head>
					<meta charSet="UTF-8" />
					<meta
						httpEquiv="X-UA-Compatible"
						content="IE=edge"
					/>
					<link rel="stylesheet" href="//demo.productionready.io/main.css" />
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}

}

export default Document;
