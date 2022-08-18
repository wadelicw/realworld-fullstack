import React from "react";
import Router from "next/router";
import autobind from "autobind-decorator";
import Immutable from "immutable";
import { NextSeo } from "next-seo";
import { connect } from "react-redux";
import { setUser } from "../../features/user/userSlice";

@connect(
    state => ({
        user: state.user
    }),
    { setUser }
)
class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loaded: true,
            loading: false,
            payload: {
                name: "",
                password: ""
            }
        };
    }

    @autobind
    async login() {
        const { name, password } = this.state.payload;

        if (name.trim() === "" || password.trim() === "") {
            return window.alert("name and password can't be empty");
        }

        this.setState({ loading: true });
        try {
            const data = await api.user.login(name, password);
            this.props.setUser(data.user, data.accessToken);
            localStorage.setItem(process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY, data.accessToken);
            return Router.replace("/");
        } catch (error) {
            console.error(error);
            window.alert(error?.response?.data?.error?.message ?? "Invalid Name or Password");
            return this.setState({ loading: false });
        }
    }

    render() {

        const { payload } = this.state;

        return (
            <>
                <NextSeo title="Login" />

                <div className="auth-page">
                    <div className="container page">

                        <button onClick={() => this.props.setUser({ user: payload.name, accessToken: "Test Token" })}>
                            Clicksss
                        </button>

                        <div className="row">
                            <div className="col-md-6 offset-md-3 col-xs-12">
                                <h1 className="text-xs-center">Sign up</h1>
                                <p className="text-xs-center">
                                    <a href="">Have an account?</a>
                                </p>

                                <ul className="error-messages">
                                    <li>That email is already taken</li>
                                </ul>
                                <form>
                                    <fieldset className="form-group">
                                        <input
                                            className="form-control form-control-lg"
                                            type="text"
                                            placeholder="Your Name"
                                            onChange={event =>
                                                this.setState(
                                                    Immutable
                                                        .Map(this.state)
                                                        .setIn(["payload", "name"], event.target.value)
                                                        .toJS()
                                                )
                                            }
                                        />
                                    </fieldset>
                                    <fieldset className="form-group">
                                        <input className="form-control form-control-lg" type="text" placeholder="Email" />
                                    </fieldset>
                                    <fieldset className="form-group">
                                        <input className="form-control form-control-lg" type="password" placeholder="Password" />
                                    </fieldset>
                                    <button className="btn btn-lg btn-primary pull-xs-right">
                                        Sign up
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

}

export default Login;
