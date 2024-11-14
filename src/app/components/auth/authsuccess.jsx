import React from "react";
import './authsuccess.css';

export default class Authsuccess extends React.Component {
    componentDidMount() {
        window.resizeTo(500, 250);
        document.title = "Authentification Réussie";

        setTimeout(() => {
            //window.close();
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