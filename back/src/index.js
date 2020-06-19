require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const routes = require('./routes');

const app = express();

const port = process.env.PORT;

app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(routes);

app.listen(port, () => console.log(`App is listening on ${port}!`));
