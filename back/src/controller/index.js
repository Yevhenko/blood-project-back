const { setUser, getUser, updateUser, getOneUser, deleteUser, } = require('./userHandler');
const { setDemand, updateDemand, deleteDemand, } = require('./demandHandler');
const { setConnection, deleteConnection, } = require('./connectionHandler');
const { makeLogin } = require('./loginHandler');

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
  makeLogin,
};
