import Head from "next/head";
import NextApp from "next/app";
import NextNProgress from "nextjs-progressbar";
import { DefaultSeo } from "next-seo";
import { Provider } from "react-redux";

import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import webConfig from "../web.config";
import { wrapper } from "../store";

import "../styles/main.scss";

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
					titleTemplate={`${webConfig.title} - %s`}
					description={webConfig.description}
					additionalMetaTags={[{
						name: "keywords",
						content: webConfig.keywords
					}]}
				/>
				<Navbar />
				<Component {...pageProps} />
				<Footer />
			</>
		);
	}

}

export default wrapper.withRedux(App);