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

// async function getUsers() {
//   try {
//     const users = await User.findAll();

//     return users.map((u) => ({
//       name: u.fullName,
//       email: u.email,
//       phone: u.phoneNumber,
//     }));
//   } catch (error) {
//     throw new Error(error);
//   }
// }

async function getOneUser(query) {
  try {
    const user = await User.findOne({
      where: {
        telegramId: query.telegramId,
      },
    });

    return user;
  } catch (error) {
    throw new Error(error);
  }
}

async function updateUser(body, query, isTelegramData) {
  try {
    let where;
    if (!isTelegramData) {
      where = { id: query.id };
    } else {
      where = { telegramId: isTelegramData.id };
    }

    const updatedUser = await User.update(
      {
        fullName: body.fullName,
        dateOfBirth: body.dateOfBirth,
        phoneNumber: await phoneNumber(body),
        email: body.email,
        bloodType: body.bloodType,
        rhesus: await rhesus(body),
        locality: body.locality,
        lastBeingDonor: body.lastBeingDonor,
        telegramId: body.telegramId,
      },
      {
        where: { where },
      },
    );

    return updatedUser;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function deleteUser(query) {
  try {
    await User.destroy({
      where: {
        id: query.id,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = {
  setUser,
  updateUser,
  getOneUser,
  deleteUser,
};
