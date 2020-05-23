require('dotenv').config();
const botApp = require('./src');

const express = require('express');

// const routes = require('../src/routes');

const app = express();

const port = process.env.PORT;

// app.use(routes); 
app.get('/', (req, res) => {
  res.send('<b> T E S T  !</b>')
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

function start() {
  botApp.launch();
}

start();
