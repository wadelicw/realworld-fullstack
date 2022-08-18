import React from "react";
import Router from "next/router";
import autobind from "autobind-decorator";
import Immutable from "immutable";

import { NextSeo } from "next-seo";
import { connect } from "react-redux";
import { withRouter } from "next/router";

import api from "../../api";
import { setUser } from "../../features/user/userSlice";

@withRouter
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
            isLogin: this.props.router.pathname === "/login",
            payload: {
                email: "",
                password: "",
                name: ""
            }
        };
    }

    @autobind
    async login() {
        const { email, password } = this.state.payload;

        if (email.trim() === "" || password.trim() === "") {
            return window.alert("email and password can't be empty");
        }

        this.setState({ loading: true });

        try {
            const { user } = await api.user.login({ email, password });
            this.props.setUser({ user: user.name, accessToken: user.token });
            localStorage.setItem(process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY, user.token);
            // return Router.replace("/");
        } catch (error) {
            console.error(error);
            window.alert(error?.status === 400 ? "Invalid Name or Password" : error.message);
            return this.setState({ loading: false });
        }
    }

    render() {

        const { isLogin, payload } = this.state;

        return (
            <>
                <NextSeo title="Login" />

                <div className="auth-page">
                    <div className="container page">

                        <div className="row">
                            <div className="col-md-6 offset-md-3 col-xs-12">
                                <h1 className="text-xs-center">
                                    {isLogin ? "Sign In" : "Sign up"}
                                </h1>
                                <p className="text-xs-center">
                                    <a href={isLogin ? "/register" : "/login"}>
                                        {isLogin ? "Need an account?" : "Have an account?"}
                                    </a>
                                </p>

                                {
                                    !isLogin && (
                                        <ul className="error-messages">
                                            <li>That email is already taken</li>
                                        </ul>
                                    )
                                }
                                <form>
                                    {
                                        !isLogin && (
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
                                        )
                                    }
                                    <fieldset className="form-group">
                                        <input
                                            className="form-control form-control-lg"
                                            type="text"
                                            placeholder="Email"
                                            onChange={event =>
                                                this.setState(
                                                    Immutable
                                                        .Map(this.state)
                                                        .setIn(["payload", "email"], event.target.value)
                                                        .toJS()
                                                )
                                            }
                                        />
                                    </fieldset>
                                    <fieldset className="form-group">
                                        <input
                                            className="form-control form-control-lg"
                                            type="password"
                                            placeholder="Password"
                                            onChange={event =>
                                                this.setState(
                                                    Immutable
                                                        .Map(this.state)
                                                        .setIn(["payload", "password"], event.target.value)
                                                        .toJS()
                                                )
                                            }
                                        />
                                    </fieldset>
                                    <button
                                        className="btn btn-lg btn-primary pull-xs-right"
                                        onClick={(event) => {
                                            event.preventDefault();
                                            isLogin ? this.login() : this.register();
                                        }}
                                    >
                                        {
                                            isLogin ? "Sign In" : "Sign Up"
                                        }
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
