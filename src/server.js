const express = require("express") ;
const cookieSession = require('cookie-session')
require('dotenv').config()
const axios = require('axios');

const port = 3000 ;
const app = express() ;

const path = require('path');
const {redirect} = require("react-router-dom");

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieSession({
    keys: [process.env.SESSION_SECRET ],
    secure: false,
    httpOnly: false,
    sameSite: 'lax',
    domain: 'localhost'
}))

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'index.html'));
});

app.get('/api/getName', async (req, res) => {
    //console.log(req.session);
    let response = await axios.get("https://discord.com/api/users/@me", {
        headers: {
            Authorization: `Bearer ${req.session.access_token}`
        }
    })
    console.log(response.data);

    res.send(response.data.global_name);
})

app.get('/api/getUserInfo', async (req, res) => {
    try {
        // Ensure the user is authenticated
        if (!req.session.access_token) {
            return res.status(401).send('Unauthorized: No access token');
        }

        // Fetch user data from Discord API
        let response = await axios.get("https://discord.com/api/users/@me", {
            headers: {
                Authorization: `Bearer ${req.session.access_token}`
            }
        });

        const userData = response.data;

        // Construct the avatar URL
        const avatarUrl = userData.avatar
            ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`
            : `https://cdn.discordapp.com/embed/avatars/${userData.discriminator % 5}.png`; // Fallback URL

        // Send the global_name and avatar URL in the response
        res.json({
            global_name: userData.global_name,
            avatarUrl: avatarUrl
        });
    } catch (error) {
        console.error("Error fetching user info:", error.response?.data || error.message);
        res.status(500).send('Error fetching user info');
    }
});

app.get('/auth/discord/callback', async (req, res) => {
    console.log(process.env.CLIENT_ID );
    console.log(process.env.CLIENT_SECRET );
    let code = req.query.code;

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
    }

    const response = await axios.post(
        "https://discord.com/api/oauth2/token",
        `client_id=${process.env.CLIENT_ID }&client_secret=${process.env.CLIENT_SECRET }&grant_type=authorization_code&code=${code.toString()}&redirect_uri=${process.env.REDIRECT_URI}&scope=identify`,
        {
            headers
        }
    );

    if (response.data) {
        const data = response.data ;

        req.session.access_token = data.access_token ;
        req.session.token_type = data.token_type;
        req.session.expires_in = data.expires_in;
        req.session.refresh_token = data.refresh_token;
        req.session.scope = data.scope;

        console.log(req.session);
    }

    res.sendFile(path.join(__dirname, 'public', 'views', 'index.html'));
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`) ;
})