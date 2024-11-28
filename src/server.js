const express = require("express");
const cookieSession = require('cookie-session')
require('dotenv').config()
const axios = require('axios');
const fs = require('fs');
const {redirect} = require("react-router-dom");
const path = require('path');
const { google } = require('googleapis');
const {expressCspHeader, INLINE, NONE, SELF} = require('express-csp-header');

const port = 3000 ;
const app = express() ;

const cookieParser = require('cookie-parser');
const { ok } = require("assert");
app.use(express.json());
app.use(cookieParser());
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
        'font-src' : ['*'],
        'connect-src' : ['http://localhost:1234', 'ws://localhost:3000/' , SELF]
    }
}));

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
        //console.log(`Mise à jour : ${res.data.updatedCells} cellules mises à jour`);
        return res.data;
    } catch (error) {
        console.error("Erreur lors de la mise à jour des données :", error);
    }
}

app.get('/api/spreadsheet', async (req,res) => {
    const data = await readSheetData(process.env.SPREADSHEET_ID, 'Remplissage skills!A2:Z100');
    res.json(data);
})

app.get('/api/spreadsheet/:name', async (req,res) => {
    const { name }= (req.params);
    nameInArray = name.replaceAll('_',' ');
    const rawData = await readSheetData(process.env.SPREADSHEET_ID, 'Remplissage skills!A2:Z100');
    const data = rawData.filter(item => item[0] === nameInArray);
    res.json(data);
})

app.post('/api/spreadsheet/change',async (req, res) => {
    const {discord_id, name, aaw, coo, cuisine, sportif, majeur} = req.body;
    const rawData = await readSheetData(process.env.SPREADSHEET_ID, 'Remplissage skills!A1:Z100');
    const dataIndex = rawData.findIndex((row, index) => row[1] === discord_id) + 1;
    if(dataIndex >= 0)
    {
        const today = new Date();
        const actualDate = today.getMonth()+'/'+today.getDay()+'/'+today.getFullYear()+' '+today.getHours()+':'+today.getMinutes()+':'+today.getSeconds();
        await updateSheetData(process.env.SPREADSHEET_ID, 'Remplissage skills!A'+dataIndex, [[name]]);
        await updateSheetData(process.env.SPREADSHEET_ID, 'Remplissage skills!C'+dataIndex, [[actualDate]]);
        await updateSheetData(process.env.SPREADSHEET_ID, 'Remplissage skills!D'+dataIndex, [[aaw]]);
        await updateSheetData(process.env.SPREADSHEET_ID, 'Remplissage skills!E'+dataIndex, [[coo]]);
        await updateSheetData(process.env.SPREADSHEET_ID, 'Remplissage skills!F'+dataIndex, [[cuisine]]);
        await updateSheetData(process.env.SPREADSHEET_ID, 'Remplissage skills!G'+dataIndex, [[sportif]]);
        await updateSheetData(process.env.SPREADSHEET_ID, 'Remplissage skills!H'+dataIndex, [[majeur]]);
        //console.log('ligne n°'+dataIndex+' :'+name+' '+discord_id+' '+aaw+' '+coo+' '+cuisine+' '+sportif+' '+majeur);
        res.sendStatus(200);
    }
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

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})