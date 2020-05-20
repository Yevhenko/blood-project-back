/* eslint-disable object-curly-newline */
const { setUser, getUsers, updateUser, getOneUser, deleteUser } = require('./userHandler');
const { setDemand, getDemandsByFilter, updateDemand, deleteDemand } = require('./demandHandler');
const { setConnection, deleteConnection } = require('./connectionHandler');
const { makeLogin } = require('./loginHandler');

module.exports = {
  setUser,
  getUsers,
  updateUser,
  getOneUser,
  deleteUser,
  setConnection,
  deleteConnection,
  setDemand,
  getDemandsByFilter,
  updateDemand,
  deleteDemand,
  makeLogin,
};
