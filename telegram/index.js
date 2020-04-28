require('dotenv').config();

const express = require('express');

const routes = require('../src/routes');

const app = express();

const port = process.env.PORT;

app.use(routes);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
