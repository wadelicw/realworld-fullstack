import Head from "next/head";
import NextApp from "next/app";
import NextNProgress from "nextjs-progressbar";
import { DefaultSeo } from "next-seo";

import webConfig from "../web.config";

class App extends NextApp {

	render() {
		const { Component, pageProps } = this.props;
		return (
			<>
				<Head>
					<meta
						name="viewport"
						content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
					/>
				</Head>
				<NextNProgress color="#ff9532" />
				<DefaultSeo
					title="Home"
					titleTemplate={`${webConfig.app} - %s`}
					description={webConfig.description}
					additionalMetaTags={[{
						name: "keywords",
						content: webConfig.keywords
					}]}
				/>
				<Component {...pageProps} />
			</>
		);
	}

}

export default App;
