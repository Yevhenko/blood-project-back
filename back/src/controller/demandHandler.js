const { Demand, User } = require('../db/models');
const { phoneNumber, rhesus } = require('./commonHandlers');

async function setDemandAndFilterForSending(body, userId) {
  try {
    const demand = await Demand.create({
      fullName: body.fullName,
      phoneNumber: await phoneNumber(body),
      bloodType: body.bloodType,
      rhesus: await rhesus(body),
      locality: body.locality,
      reason: body.reason,
      userId,
    });

    const needableUsers = await User.findAll({
      where: { bloodType: demand.bloodType, rhesus: demand.rhesus },
    });

    return needableUsers;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getDemandsByFilter(query) {
  try {
    const demands = await Demand.findAll({
      where: { bloodType: query.bloodType, rhesus: query.rhesus },
    });

    return demands.map((d) => ({
      name: d.fullName,
      phoneNumber: d.phoneNumber,
      locality: d.locality,
      reason: d.reason,
    }));
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function updateDemand(body, query, userId) {
  try {
    const updatedDemand = await Demand.update(
      {
        fullName: body.fullName,
        phoneNumber: await phoneNumber(body),
        bloodType: body.bloodType,
        rhesus: await rhesus(body),
        locality: body.locality,
        reason: body.reason,
        userId,
      },
      {
        where: {
          id: query.id,
        },
      },
    );

    return updatedDemand;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function deleteDemand(query) {
  try {
    await Demand.destroy({
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
  setDemandAndFilterForSending,
  getDemandsByFilter,
  updateDemand,
  deleteDemand,
};
