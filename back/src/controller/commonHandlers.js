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
  try {
    if (body.rhesus === '+') return 1;
    if (body.rhesus === '-') return 0;
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = { phoneNumber, rhesus };
