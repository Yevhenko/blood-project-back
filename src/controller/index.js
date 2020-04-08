const { Connection, User, Demand } = require('../db/models');

async function setUser(body) {
  try {
    await User.create({
      fullName: body.fullName,
      dateOfBirth: body.dateOfBirth,
      sex: body.sex,
      phoneNumber: body.phoneNumber,
      email: body.email,
      bloodType: body.bloodType,
      rhesus: body.rhesus,
      locality: body.locality,
      lastBeingDonor: body.lastBeingDonor,
      photo: body.photo,
      connectionId: Connection.id,
    });
  } catch (error) {
    console.error(error);
  }
}

async function setDemand(body) {
  try {
    await Demand.create({
      fullName: body.fullName,
      sex: body.sex,
      phoneNumber: body.phoneNumber,
      bloodType: body.bloodType,
      rhesus: body.rhesus,
      locality: body.locality,
      reason: body.reason,
      userId: User.id,
    });
  } catch (error) {
    console.error(error);
  }
}

// eslint-disable-next-line no-unused-vars
async function setConnection(body) {
  try {
    await Connection.create({
      demandId: Demand.id,
    });
  } catch (error) {
    console.error(error);
  }
}

async function getUser() {
  try {
    return await User.findAll();
  } catch (error) {
    return error;
  }
}

module.exports = {
  setUser,
  setConnection,
  setDemand,
  getUser,
};
