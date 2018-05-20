const http = require('http')
const express = require('express');
const bodyParser = require('body-parser');
const bot = require('./bot');
const config = require('./config.json');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/buildNotification', (req, res) => {
    let resp = bot.sendCodeshipBuildNotification(req.body);
    res.send(resp);
})

app.post('/bitbucketNotification', (req, res) => {
    let resp = bot.sendBitbucketNotification(req.body);
    res.send(resp);
})

const port = config.port || '3000';
app.set('port', port);

const server = http.createServer(app);
server.listen(port, () => console.log(`[INFO] API running on localhost:${port}`));