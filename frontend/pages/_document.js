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
					<link
						rel="stylesheet"
						href="//demo.productionready.io/main.css"
					/>
					<link
						href="//code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css"
						rel="stylesheet"
						type="text/css"
					/>
					<link
						href="//fonts.googleapis.com/css?family=Titillium+Web:700|Source+Serif+Pro:400,700|Merriweather+Sans:400,700|Source+Sans+Pro:400,300,600,700,300italic,400italic,600italic,700italic"
						rel="stylesheet"
						type="text/css"
					/>
					<link
						rel="stylesheet"
						href="//demo.productionready.io/main.css"
					/>
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
