const PNF = require('google-libphonenumber').PhoneNumberFormat;
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

async function phoneNumber(body) {
  try {
    const number = phoneUtil.format(phoneUtil.parse(body.phoneNumber, 'UA'), PNF.INTERNATIONAL);
    return number;
  } catch (error) {
    throw new Error(error);
  }
}

async function rhesus(body) {
  switch (body.rhesus) {
    case '+':
      return 1;

    case '-':
      return 0;

    default:
      throw new Error();
  }
}

function strcmp(a, b) {
  if (a < b) return -1;

  if (a > b) return 1;

  return 0;
}

module.exports = { strcmp, phoneNumber, rhesus };
