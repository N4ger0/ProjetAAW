import React from "react";
import './auth.css';

export default class Authsuccess extends React.Component {
    componentDidMount() {
        window.resizeTo(500, 240);
        document.title = "Authentification Réussie";

        window.addEventListener("close", () => {
            window.opener.location.reload();
        });

        setTimeout(() => {
            window.close();
        }, 2000);
    }

    render() {
        return (
            <div id="authsuccess">
                <h1> Authentification réussie ! </h1>
                <div className="loading-animation"></div>
            </div>
        )
    }
}