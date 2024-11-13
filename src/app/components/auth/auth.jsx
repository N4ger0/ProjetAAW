import React from "react";

export default class Auth extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: Boolean(document.cookie.match(/^(.*;)?\s*session\s*=\s*[^;]+(.*)?$/))  // Check session cookie initially
        };
    }

    signInWithDiscord = () => {
        const clientId = process.env.CLIENT_ID;
        const redirectUri = process.env.REDIRECT_URI;
        const scope = process.env.SCOPE;
        const responseType = process.env.RESPONSE_TYPE;
        const discordAuthUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&response_type=${responseType}&redirect_uri=${redirectUri}&scope=${scope}`;

        const width = 600;
        const height = 600;
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;

        const popup = window.open(
            discordAuthUrl,
            '_blank',
            `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes,status=yes`
        );

        // Poll to detect when the popup closes
        const popupInterval = setInterval(() => {
            if (popup.closed) {
                console.log("Popup closed");
                clearInterval(popupInterval);
                let name = fetch("http://localhost:3000/api/getName");

                // Check again if session cookie is present
                const isLoggedIn = Boolean(document.cookie.match(/^(.*;)?\s*session\s*=\s*[^;]+(.*)?$/));
                if (isLoggedIn) {
                    this.setState({ isLoggedIn: true });
                    // Optionally notify parent component
                    if (this.props.onLogin) {
                        this.props.onLogin(true);
                    }
                }
            }
        }, 500);
    };

    render() {
        const { isLoggedIn } = this.state;

        if (isLoggedIn) {
            return (
                <div id="signInDiscord" className="connected">
                    <img className="icon"
                        src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/discord-white-icon.png"
                        alt="Discord"/>
                </div>
            );
        } else {
            return (
                <button id="signInDiscord" onClick={this.signInWithDiscord}>
                    <img className="icon"
                        src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/discord-white-icon.png"
                        alt="Discord"/>
                    S'authentifier avec Discord
                </button>
            );
        }
    }
}