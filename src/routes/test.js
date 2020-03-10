const express = require('express');
const test = express.Router();

test.get('/end-one', (req, res, next) => {
    try {
        console.log('TEST FUNCTION WORKS!!!');

        res.status(200).send('Successful');
    } catch (error) {
        console.error('test func error -', error);
    }
});

module.exports = test;
