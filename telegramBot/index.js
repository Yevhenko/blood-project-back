require('dotenv').config();
const express = require('express');

const { initConfig, getPort } = require('./src/config');
initConfig(process.env);
const botApp = require('./src');

const app = express();

const port = getPort();

// app.use(routes); 
app.get('/', (req, res) => {
  res.send('<b> T E S T  !</b>')
})

app.listen(port, () => console.log(`Bot is listening on port ${port}!`));

function start() {
  botApp.launch();
}

start();
