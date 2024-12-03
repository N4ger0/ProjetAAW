import React from "react";
import {useAuth} from "../../index";

export default class Auth extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: null,
            avatarUrl: null,
            isLogged: null,
        };
    }

    async componentDidMount() {
        const response = await fetch("http://localhost:3000/api/isLogged", {
            method: 'GET',
            credentials: 'same-origin'
        });

        const { isLogged } = await response.json();

        if (isLogged==="expired"){
            window.alert("Session expirée, veuillez vous reconnecter ! Merci");
        }
        else if (isLogged) {
            this.setState({ isLogged: true });
            await this.fetchUserInfo();
            this.props.setLogged(true);
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

        const popupInterval = setInterval(async () => {
            if (popup.closed) {
                clearInterval(popupInterval);

                const response = await fetch("http://localhost:3000/api/isLogged", {
                    method: 'GET',
                    credentials: 'same-origin'
                });

                const { isLogged } = await response.json();
                if (isLogged) {
                    this.setState({ isLogged: true });
                    this.fetchUserInfo();
                    this.props.setLogged(true);
                }
            }
        }, 500);
    };

    fetchUserInfo = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/getUserInfo", {
                method: 'GET',
                credentials: 'same-origin'
            });

            const { global_name, avatarUrl } = await response.json();
            this.setState({ username: global_name, avatarUrl });
        } catch (error) {
            console.error("Failed to fetch user info:", error);
        }
    };

    logout = async () => {
        const response = await fetch('/api/logout', {
            method: 'POST',
            credentials: 'include',
        });

        if (response.ok) {
            this.props.setLogged(false);
            this.setState({
                username: null,
                avatarUrl: null,
                isLogged: false,
            });
        } else {
            console.error('Failed to log out:', response.statusText);
        }
    };

    render() {
        const { username, avatarUrl, isLogged } = this.state;

        return isLogged ? (
            <div
                id="signInDiscord"
                className="connected"
                onClick={this.logout}
            >
                {username ? (
                    <>
                        <img className="rounded_icon" src={avatarUrl} alt="Discord" />
                        <span className="default-text">{username}</span>
                        <span className="hover-text">Se déconnecter</span>
                    </>
                ) : (
                    <span>En attente...</span>
                )}
            </div>
        ) : (
            <button id="signInDiscord" onClick={this.signInWithDiscord}>
                <img
                    className="icon"
                    src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/discord-white-icon.png"
                    alt="Discord"
                />
                S'authentifier avec Discord
            </button>
        );
    }
}