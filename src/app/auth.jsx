import React from "react";

export default class Auth extends React.Component {
     signInWithDiscord = () => {
        const clientId = process.env.CLIENT_ID;
        const redirectUri = process.env.REDIRECT_URI;
        const scope = process.env.SCOPE;
        const responseType = process.env.RESPONSE_TYPE;
        const discordAuthUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&response_type=${responseType}&redirect_uri=${redirectUri}&scope=${scope}`;

        const width = 500;
        const height = 600;
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;

        const popup = window.open(
            discordAuthUrl,
            '_blank',
            `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes,status=yes`
        );
    };

    render() {
        return(
            <button onClick={this.signInWithDiscord}> S'authentifier avec Discord </button>
        )
    }
}