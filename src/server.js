const express = require("express") ;
const session = require('express-session')
require('dotenv').config()
const axios = require('axios');

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

const port = 3000 ;
const app = express() ;

const path = require('path');
const {redirect} = require("react-router-dom");

app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: process.env.SESSION_SECRET ,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}))

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'index.html'));
});

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

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`) ;
})