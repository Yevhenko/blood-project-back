const { Connection } = require('../db/models');

async function setConnection(body) {
  try {
    return await Connection.create({
      userId: body.userId,
      demandId: body.demandId,
    });
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
