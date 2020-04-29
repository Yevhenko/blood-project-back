const { Connection, User, Demand } = require('../db/models');

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
  setConnection,
  deleteConnection,
};
