const express = require("express");
const cookieSession = require('cookie-session')
require('dotenv').config()
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const {redirect} = require("react-router-dom");
const { google } = require('googleapis');
const {expressCspHeader, INLINE, NONE, SELF} = require('express-csp-header');


const port = 3000 ;
const app = express() ;

const path = require('path');
const {redirect} = require("react-router-dom");

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const SPREADSHEET_ID = '1BID2_QCGI1BLs6uTN1KADR-FYbG-BEyPmnlgOI0d1kI';
const keyFilePath = path.join(__dirname, 'auth', 'credential.json');

// Utilise le chemin relatif vers ton fichier de clés JSON
const auth = new google.auth.GoogleAuth({
    keyFile: keyFilePath, // Assurez-vous que le nom du fichier est correct
    scopes: ['https://www.googleapis.com/auth/spreadsheets'], // Permissions pour lire et écrire
});

async function readSheetData(spreadsheetId, range) {
    try {
        const authClient = await auth.getClient();
        const sheets = google.sheets({ version: 'v4', auth: authClient });

        const res = await sheets.spreadsheets.values.get({
            spreadsheetId: spreadsheetId,
            range: range,
        });
        return res.data.values;
    } catch (error) {
        console.error("Erreur lors de la lecture des données :", error);
    }
}

async function updateSheetData(spreadsheetId, range, values) {
    try {
        const authClient = await auth.getClient();
        const sheets = google.sheets({ version: 'v4', auth: authClient });

        const res = await sheets.spreadsheets.values.update({
            spreadsheetId: spreadsheetId,
            range: range,
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: values, // Par exemple, [[ "Nouvelle Valeur" ]]
            },
        });
        console.log(`Mise à jour : ${res.data.updatedCells} cellules mises à jour`);
        return res.data;
    } catch (error) {
        console.error("Erreur lors de la mise à jour des données :", error);
    }
}


app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieSession({
    keys: [process.env.SESSION_SECRET],
    secure: false,
    httpOnly: false,
    sameSite: 'lax',
    domain: 'localhost'
}))

app.use(expressCspHeader({
    directives: {
        'default-src': [SELF],
        'script-src': ["http://localhost:1234", "'unsafe-eval'"],
        'style-src': ['http://localhost:1234'],
        'img-src': ['*'],
        'font-src' : ['*']
    }
}));

app.get('/api/spreadsheet', async (req,res) => {
    const data = await readSheetData(SPREADSHEET_ID, 'Sheet1!A1:E6');
    res.json(data);
})

app.get('/api/spreadsheet/:name', async (req,res) => {
    const { name }= (req.params);
    nameInArray = name.replaceAll('_',' ');
    const rawData = await readSheetData(SPREADSHEET_ID, 'Sheet1!A1:E6');
    const data = rawData.filter(item => item[0] === nameInArray);
    res.json(data);
})

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

        req.session.discord_id = userData.id;
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
    console.log(process.env.CLIENT_ID);
    console.log(process.env.CLIENT_SECRET);
    let code = req.query.code;

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
    }

    const response = await axios.post(
        "https://discord.com/api/oauth2/token",
        `client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=authorization_code&code=${code.toString()}&redirect_uri=${process.env.REDIRECT_URI}&scope=identify`,
        {
            headers
        }
    );

    if (response.data) {
        const data = response.data;

        req.session.access_token = data.access_token;
        req.session.token_type = data.token_type;
        req.session.expires_in = data.expires_in;
        req.session.refresh_token = data.refresh_token;
        req.session.scope = data.scope;

        console.log(req.session);
    }

    res.sendFile(path.join(__dirname, 'public', 'views', 'index.html'));
});

app.get('/*', (req,res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'index.html'));
});

app.get('/*', (req,res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'index.html'));
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})