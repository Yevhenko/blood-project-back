const { Demand } = require('../db/models');
const { phoneNumber, rhesus } = require('./commonHandlers');

async function setDemand(body) {
  try {
    const demand = await Demand.create({
      fullName: body.fullName,
      phoneNumber: await phoneNumber(body),
      bloodType: body.bloodType,
      rhesus: await rhesus(body),
      locality: body.locality,
      reason: body.reason,
      userId: body.userId,
    });

    return demand;
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

    return demands;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function updateDemand(body, query) {
  try {
    const updatedDemand = await Demand.update(
      {
        fullName: body.fullName,
        phoneNumber: await phoneNumber(body),
        bloodType: body.bloodType,
        rhesus: await rhesus(body),
        locality: body.locality,
        reason: body.reason,
        userId: body.userId,
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
  setDemand,
  getDemandsByFilter,
  updateDemand,
  deleteDemand,
};
