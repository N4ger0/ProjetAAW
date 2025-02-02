const express = require("express");
const cookieSession = require('cookie-session')
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const mysql = require('mysql2')
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
const {update} = require("store/plugins/all_tests");
const cookieParser = require("cookie-parser");
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
    const { sessionID } = req.cookies;

    if (!sessionID) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const data = await readSheetData(process.env.SPREADSHEET_ID, process.env.SPREADSHEET_FEUILLE);
    res.json(data);
})

app.get('/api/spreadsheet/:name', async (req,res) => {
    const { sessionID } = req.cookies;

    if (!sessionID) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const { name }= (req.params);
    let nameInArray = name.replaceAll('_',' ');
    const rawData = await readSheetData(process.env.SPREADSHEET_ID, process.env.SPREADSHEET_FEUILLE);
    const data = rawData.filter((item, index) => item[0] === nameInArray || index == 0); //LAISSER LE WARNING, index est number et 0 est int, on a besoin de l'inférence de type
    res.json(data);
})

app.get('/api/spreadsheet/canModify/:discord_id', (req, res) => {
    const { discord_id } = (req.params);
    const { sessionID } = req.cookies;

    if (!sessionID) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const query = 'SELECT * FROM sessions WHERE session_id = ?';

    connection.query(query, [sessionID], (err, results) => {
        if (err) {
            console.error("Error checking session ID:", err);
            return res.status(500).send('Internal Server Error');
        }

        if (results.length > 0) {
            const sessionInfos = results[0];

            let sessionData;

            try {
                sessionData = JSON.parse(sessionInfos.data);
                console.log(sessionData)
            } catch (parseError) {
                console.error("Error parsing session data:", parseError);
                return res.status(500).send('Error parsing session data');
            }

            const discord_id_db = sessionData.discord_id;

            if (adminUsers.includes(discord_id_db)) {
                res.json({canModify : true})
            }
            else {
                console.log(discord_id);
                console.log(discord_id_db);

                if (discord_id === discord_id_db) {
                    res.json({canModify: true})
                } else {
                    res.json({canModify: false})
                }
            }
        }
    });
})

app.post('/api/spreadsheet/change',async (req, res) => {
    const { sessionID } = req.cookies;

    if (!sessionID) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const update_value = req.body;
    const rawData = await readSheetData(process.env.SPREADSHEET_ID, process.env.SPREADSHEET_FEUILLE);
    const dataIndex = rawData.findIndex((row, index) => row[1] === update_value[1]) + 1; //discord_id == discord_id
    console.log(dataIndex);
    console.log(update_value);
    if(dataIndex >= 0)
    {
        for(let i = 0 ; i < rawData[0].length; i++){
            await updateSheetData(process.env.SPREADSHEET_ID, process.env.SPREADSHEET_FEUILLE + '!' + String.fromCharCode(65+i) + dataIndex, [[update_value[i]]])
        }
        res.sendStatus(200);
    }
})

app.get('/api/getName', async (req, res) => {
    const { sessionID } = req.cookies;

    if (!sessionID) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    let response = await axios.get("https://discord.com/api/users/@me", {
        headers: {
            Authorization: `Bearer ${req.session.access_token}`
        }
    })
    console.log(response.data);

    res.send(response.data.global_name);
})

app.get('/api/getUserInfo', async (req, res) => {
    const { sessionID } = req.cookies;

    if (!sessionID) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

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

        req.session.discord_id = userData.id ;
        req.session.global_name = userData.global_name ;

        res.json({
            global_name: userData.global_name,
            discord_id: userData.id, //TODO enlever le discord id ?
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
        return res.json({ isLogged: false,
            isAdmin : false});
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
                    console.log(sessionData)
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

app.get('/api/admin/info', (req, res) => {
    const { sessionID } = req.cookies;

    if (!sessionID) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const query = 'SELECT * FROM sessions';

    result = [] ;
    result.push(["Discord id", "Global name", "Expiration"])

    connection.query(query, (err, results) => {
        if (err) {
            console.error("Error checking sessions:", err);
            return res.status(500).send('Internal Server Error');
        }

        if (results.length > 0) {
            for (let i = 0; i < results.length; i++) {
                if (results[i].expires > Date.now() / 1000) {
                    let data = JSON.parse(results[i].data)
                    result.push([data.discord_id, data.global_name, results[i].expires])
                }
                else {
                    const deleteQuery = 'DELETE FROM sessions WHERE session_id = ?';

                    connection.query(deleteQuery, [results[i].sessionID], (deleteErr, deleteResults) => {
                        if (deleteErr) {
                            console.error("Error deleting expired session:", deleteErr);
                            return res.status(500).send('Internal Server Error');
                        }
                    });
                }
            }
        } else {
            res.status(404).send('No session data found');
        }

        try {
            res.json(result);
        } catch (parseError) {
            console.error("Error parsing session data:", parseError);
            return res.status(500).send('Error parsing session data');
        }
    });
})

app.get('/api/admin/disconnect/:discord_id', (req, res) => {
    const { sessionID } = req.cookies;

    if (!sessionID) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const { discord_id } = (req.params);

    const query = "SELECT * FROM sessions WHERE data LIKE ?";

    let compteur = 0 ;

    connection.query(query, ["%" + discord_id + "%"], (err, results) => {
        if (err) {
            console.error("Error checking session ID:", err);
            return res.status(500).send('Internal Server Error');
        }

        if (results.length > 0) {
            const deleteQuery = 'DELETE FROM sessions WHERE session_id = ?';
            for (let i = 0; i < results.length; i++) {
                connection.query(deleteQuery, [results[i].session_id], (deleteErr, deleteResults) => {
                    if (deleteErr) {
                        console.error("Error deleting expired session:", deleteErr);
                        return res.status(500).send('Internal Server Error');
                    }
                });
            }
        }
    });

    res.send("ok");
})

app.get('/api/bot/:name', async (req,res) => {
    let discord_id = req.header("Authorization") ;

    if(!discord_id) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    if(isNaN(discord_id)) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const { name } = (req.params);
    let nameInArray = name.replaceAll('_',' ');
    const rawData = await readSheetData(process.env.SPREADSHEET_ID, process.env.SPREADSHEET_FEUILLE);
    const data = rawData.filter((item, index) => item[0] === nameInArray || index == 0); //LAISSER LE WARNING, index est number et 0 est int, on a besoin de l'inférence de type
    res.json(data);
})

app.post('/api/bot/change',async (req, res) => {
    let discord_id = req.header("Authorization") ;

    if(!discord_id) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    if(isNaN(discord_id)) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const {skill, value} = req.body;

    console.log(skill)
    console.log(value)
    console.log(req.body)
    const rawData = await readSheetData(process.env.SPREADSHEET_ID, process.env.SPREADSHEET_FEUILLE);
    const rowIndex = rawData.findIndex((row, index) => row[1] === discord_id) + 1;
    const colIndex = rawData[0].indexOf(skill);

    if(rowIndex >= 0 && colIndex >= 0)
    {
        const now = new Date();
        let response = await updateSheetData(process.env.SPREADSHEET_ID, process.env.SPREADSHEET_FEUILLE + '!' + String.fromCharCode(65+colIndex) + rowIndex, [[value]])
        await updateSheetData(process.env.SPREADSHEET_ID, process.env.SPREADSHEET_FEUILLE + '!' + String.fromCharCode(65+2) + rowIndex, [[now.toLocaleString("fr-FR")]])
        res.send(response).status(200);
    }
})

app.get('/*', (req,res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'index.html'));
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})