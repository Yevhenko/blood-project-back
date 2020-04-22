const { Connection, User, Demand } = require('../db/models');

async function setUser(body) {
  try {
    const user = await User.create({
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
    });

    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getUser() {
  try {
    const users = await User.findAll();

    return users.map((u) => ({
      name: u.fullName,
      email: u.email,
      phone: u.phoneNumber,
    }));
  } catch (error) {
    throw new Error(error);
  }
}

async function getOneUser(query) {
  try {
    const user = await User.findAll({
      where: {
        id: query.id,
      },
    });

    return user;
  } catch (error) {
    throw new Error(error);
  }
}

async function updateUser(body, query) {
  try {
    const updatedUser = await User.update(
      {
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
      },
      {
        where: {
          id: query.id,
        },
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

async function setDemand(body) {
  try {
    const demand = await Demand.create({
      fullName: body.fullName,
      sex: body.sex,
      phoneNumber: body.phoneNumber,
      bloodType: body.bloodType,
      rhesus: body.rhesus,
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

async function updateDemand(body, query) {
  try {
    const updatedDemand = await Demand.update({
      fullName: body.fullName,
      sex: body.sex,
      phoneNumber: body.phoneNumber,
      bloodType: body.bloodType,
      rhesus: body.rhesus,
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

// eslint-disable-next-line no-unused-vars
async function setConnection(body) {
  try {
    const connection = await Connection.create({
      demandId: body.demandId,
      userId: body.userId,
    });

    return connection;
  } catch (error) {
    console.error(error);
  }
}

async function deleteConnection(query) {
  try {
    await Connection.destroy({
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
  getUser,
  updateUser,
  getOneUser,
  deleteUser,
  setConnection,
  deleteConnection,
  setDemand,
  updateDemand,
  deleteDemand,
};
