const express = require("express") ;

const port = 3000 ;
const app = express() ;

const path = require('path')

app.use(express.static("public"));

app.get('/*', (req,res) => {
    res.sendFile("./public/index.html", {root: path.join(__dirname)});
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`) ;
})