const express = require("express") ;

const port = 3000 ;
const app = express() ;

const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'index.html'));
});

app.get("/auth/discord/callback", (req,res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'index.html'));
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`) ;
})