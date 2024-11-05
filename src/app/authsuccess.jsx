import React from "react";

export default class Authsuccess extends React.Component {
    componentDidMount () {
        window.addEventListener("close", () => {
            window.opener.location.reload();
        })
        /*window.onclose = () => {
            window.opener.location.reload();
        }*/
    }

    render() {
        return (
            <div id="authsuccess">
                <p> Authentification réussie ! </p>
                <p> Vous pouvez fermer cette fenêtre. </p>
            </div>
        )
    }
}