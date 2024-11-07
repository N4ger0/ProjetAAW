import React from "react";

export default class Auth extends React.Component {
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

         const popupInterval = setInterval(() => {
             if (popup.closed) {
                 console.log("Popup closed");
                 clearInterval(popupInterval);  // Stop polling
                 //window.location.reload();       // Reload the page
                 //this.props.setLogged(true);
             }
         }, 500);
    };

     render() {
         //Vérifie si un cookie appelé session est set cad si l'utilisateur est connecté
         if (document.cookie.match(/^(.*;)?\s*session\s*=\s*[^;]+(.*)?$/)) {
             return null;
         } else {
             return (
                 <button onClick={this.signInWithDiscord}>
                     <img
                         src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/discord-white-icon.png"
                         alt="Discord"/>
                     S'authentifier avec Discord
                 </button>
             )
         }
     }
}