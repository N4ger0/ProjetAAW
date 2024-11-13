const express = require("express") ;
const session = require('express-session')
require('dotenv').config()
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const {redirect} = require("react-router-dom");
const { google } = require('googleapis');

const port = 3000 ;
const app = express() ;

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

/*  TODO : refresh token
import requests

API_ENDPOINT = 'https://discord.com/api/v10'
CLIENT_ID = '332269999912132097'
CLIENT_SECRET = '937it3ow87i4ery69876wqire'

def refresh_token(refresh_token):
  data = {
    'grant_type': 'refresh_token',
    'refresh_token': refresh_token
  }
  headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
  r = requests.post('%s/oauth2/token' % API_ENDPOINT, data=data, headers=headers, auth=(CLIENT_ID, CLIENT_SECRET))
  r.raise_for_status()
  return r.json()
 */

app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: process.env.SESSION_SECRET ,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}))

app.get('/api/spreadsheet', async (req,res) => {
    const data = await readSheetData(SPREADSHEET_ID, 'Sheet1!A1:E6');
    res.json(data);
})

app.get('/auth/discord/callback', async (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'index.html'));
    console.log(process.env.CLIENT_ID );
    console.log(process.env.CLIENT_SECRET );
    let code = req.query.code;

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
    }

    const response = await axios.post(
        "https://discord.com/api/oauth2/token",
        `client_id=${process.env.CLIENT_ID }&client_secret=${process.env.CLIENT_SECRET }&grant_type=client_credentials&code=${code.toString()}&redirect_uri=${encodeURI("http://localhost:3000")}&scope=identify`,
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
});

app.get('/*', (req,res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'index.html'));
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`) ;
})