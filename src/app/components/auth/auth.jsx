import React from "react";

export default class Auth extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: Boolean(document.cookie.match(/^(.*;)?\s*session\s*=\s*[^;]+(.*)?$/)),  // Check session cookie initially
            username: null,
            avatarUrl: null  // Add a state for avatar URL
        };
    }

    componentDidMount() {
        // Fetch username and avatar if already logged in on component mount
        if (this.state.isLoggedIn) {
            this.fetchUserInfo();
        }
    }

    signInWithDiscord = () => {
        const clientId = process.env.CLIENT_ID;
        const redirectUri = "http://localhost:3000/auth/discord/callback";
        const scope = "identify";
        const responseType = "code";
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

        const popupInterval = setInterval(() => {
            if (popup.closed) {
                clearInterval(popupInterval);

                // Check if session is established
                const isLoggedIn = Boolean(document.cookie.match(/^(.*;)?\s*session\s*=\s*[^;]+(.*)?$/));
                if (isLoggedIn) {
                    this.setState({ isLoggedIn: true });
                    this.fetchUserInfo();
                }
            }
        }, 500);
    };

    fetchUserInfo = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/getUserInfo");
            const { global_name, avatarUrl } = await response.json();
            this.setState({ username: global_name, avatarUrl });
        } catch (error) {
            console.error("Failed to fetch user info:", error);
        }
    };

    render() {
        const { isLoggedIn, username, avatarUrl } = this.state;

        return isLoggedIn ? (
            <div id="signInDiscord" className="connected">
                <img className="rounded_icon"
                     src={avatarUrl}
                     alt="Discord"/>
                {username ? <span>{username}</span> : <span>En attente...</span>}
            </div>
        ) : (
            <button id="signInDiscord" onClick={this.signInWithDiscord}>
                <img className="icon"
                     src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/discord-white-icon.png"
                     alt="Discord"/>
                S'authentifier avec Discord
            </button>
        );
    }
}