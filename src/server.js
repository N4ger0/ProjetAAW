const express = require("express");
const cookieSession = require('cookie-session')
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const mysql = require('mysql2')
const cookieParser = require('cookie-parser');
const axios = require('axios');
const fs = require('fs');
const {redirect} = require("react-router-dom");
const path = require('path');
const { google } = require('googleapis');
const {expressCspHeader, INLINE, NONE, SELF} = require('express-csp-header');
require('dotenv').config()


const dbOptions = {
    host: 'localhost',
    port: 3306,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
};

console.log(dbOptions);

const port = 3000 ;
const app = express() ;

const { ok } = require("assert");
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const connection = mysql.createPool(dbOptions);

const sessionStore = new MySQLStore({}, connection);

app.use(session({
    secret: [process.env.SESSION_SECRET],
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        secure: false
    }
}));

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
                values: values,
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
        if (!req.session.access_token) {
            return res.status(401).send('Unauthorized: No access token');
        }

        let response = await axios.get("https://discord.com/api/users/@me", {
            headers: {
                Authorization: `Bearer ${req.session.access_token}`
            }
        });

        const userData = response.data;

        const avatarUrl = userData.avatar
            ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`
            : `https://cdn.discordapp.com/embed/avatars/${userData.discriminator % 5}.png`;

        res.json({
            global_name: userData.global_name,
            discord_id: userData.id,
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

        res.cookie('sessionID', req.sessionID, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: data.expires_in * 1000,
            sameSite: 'Strict'
        });
    }

    res.sendFile(path.join(__dirname, 'public', 'views', 'index.html'));
});

app.post('/api/logout', (req, res) => {
    const { sessionID } = req.cookies;

    if (!sessionID) {
        return res.status(400).json({ message: 'No session found to log out.' });
    }

    const deleteQuery = 'DELETE FROM sessions WHERE session_id = ?';

    connection.query(deleteQuery, [sessionID], (err, results) => {
        if (err) {
            console.error("Error deleting session during logout:", err);
            return res.status(500).send('Internal Server Error');
        }

        res.clearCookie('sessionID');
        return res.json({ message: 'Successfully logged out.' });
    });
});

const adminUsers = process.env.ADMIN_USERS.split(',');
console.log(adminUsers);

app.get('/api/isLogged', (req, res) => {
    const { sessionID } = req.cookies;

    if (!sessionID) {
        return res.json({ isLogged: false });
    }

    const query = 'SELECT * FROM sessions WHERE session_id = ?';

    connection.query(query, [sessionID], (err, results) => {
        if (err) {
            console.error("Error checking session ID:", err);
            return res.status(500).send('Internal Server Error');
        }

        if (results.length > 0) {
            const sessionInfos = results[0];
            const expires = sessionInfos.expires;

            if (expires > Date.now() / 1000) {

                let sessionData;

                try {
                    sessionData = JSON.parse(sessionInfos.data);
                } catch (parseError) {
                    console.error("Error parsing session data:", parseError);
                    return res.status(500).send('Error parsing session data');
                }

                const discordId = sessionData.discord_id;

                console.log("id a check : ", discordId, " vs ids admin : ", adminUsers);

                if (adminUsers.includes(discordId)) {
                    console.log("Admin user logged in:", discordId);
                    return res.json({
                        isLogged: true,
                        isAdmin : true
                    });
                }
                else {
                    return res.json({
                        isLogged: true,
                        isAdmin : false
                    });
                }

            } else {
                const deleteQuery = 'DELETE FROM sessions WHERE session_id = ?';

                connection.query(deleteQuery, [sessionID], (deleteErr, deleteResults) => {
                    if (deleteErr) {
                        console.error("Error deleting expired session:", deleteErr);
                        return res.status(500).send('Internal Server Error');
                    }
                });

                res.clearCookie('sessionID');
                return res.json({ isLogged: "expired" });
            }
        } else {
            console.log("No session found for: ", sessionID);
            return res.json({ isLogged: false });
        }
    });
});

app.get('/*', (req,res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'index.html'));
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})