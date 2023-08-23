const express = require('express')
const initDB = require('./config/db')
const bodyParser = require('body-parser')
const helmet = require('helmet')

const app = express()

// IP PUBLICA: http://195.55.82.26:2121/

const port = 2121
const passport = require('passport')
const https = require('https');

const fs = require('fs');

const key = fs.readFileSync('./key.pem');

const cert = fs.readFileSync('./cert.pem');

const server = https.createServer({key: key, cert: cert }, app);
// for parsing json
app.use(helmet());

app.use(
    bodyParser.json({
        limit: '8000mb',
        extended: false

    })
)


app.use(passport.initialize())

app.use(require('./app/routes'))
app.get('/', (req, res) => { res.send('Miranza | Powered by TIGestión') });
app.use((req, res) => {
    res.status(404).send("<h1>Página no encontrada</h1> <br>Miranza | Powered by TIGestión");
});

app.listen(port, () => {
    console.log(`Servidor API TiGestión en el puerto ${port}`)
})

