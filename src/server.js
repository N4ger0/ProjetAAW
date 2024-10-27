const express = require("express") ;

const port = 3000 ;
const app = express() ;

const path = require('path');
require('dotenv').config()

const { providers } = require('@cloudflare/authr');
const discordProvider = new providers({
    clientId: process.env["CLIENT_ID "],
    clientSecret: process.env["CLIENT_SECRET "],
    redirectUri: 'http://localhost:3000/auth/discord/callback',
    scopes: ['user']
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/*', (req,res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'index.html'));
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`) ;
})