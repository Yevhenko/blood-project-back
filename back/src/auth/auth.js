const jwt = require('jsonwebtoken');
const config = require('./index');

function auth(req, res, next) {
  const token = req.cookie;
  if (token) {
    req.context = jwt.verify(token, config.secret);
    res.cookie('tgUser', '');

    next(req);
  }
}

module.exports = { auth };
