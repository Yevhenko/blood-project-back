const { Connection } = require('../db/models');

async function setConnection(body) {
  try {
    const connection = await Connection.create({
      userId: body.demandId,
      demandId: body.demandId,
    });

    return connection;
  } catch (error) {
    console.error(error);
    throw error;
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
