const { User } = require('../db/models');
const { phoneNumber, rhesus } = require('./commonHandlers');

async function setUser(body) {
  try {
    const user = await User.create({
      fullName: body.fullName,
      dateOfBirth: body.dateOfBirth,
      phoneNumber: await phoneNumber(body),
      email: body.email,
      bloodType: body.bloodType,
      rhesus: await rhesus(body),
      locality: body.locality,
      lastBeingDonor: body.lastBeingDonor,
      telegramId: body.telegramId,
    });

    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = { setUser };
