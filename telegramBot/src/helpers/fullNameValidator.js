const validator = require('validator');

const fullNameValidator = (input) => input.split(' ').every(function (str) { return validator.isAlpha(str, 'uk-UA'); })

module.exports = {
  fullNameValidator,
};
