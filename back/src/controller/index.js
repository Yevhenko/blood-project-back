/* eslint-disable object-curly-newline */
const { updateUser, getOneUser, deleteUser } = require('./userHandler');
const { setUser } = require('./registrationHandler');
const {
  setDemandAndFilterForSending,
  getDemandsByFilter,
  updateDemand,
  deleteDemand,
} = require('./demandHandler');
const { setConnection, deleteConnection } = require('./connectionHandler');
const { makeLogin } = require('./loginHandler');

module.exports = {
  setUser,
  updateUser,
  getOneUser,
  deleteUser,
  setConnection,
  deleteConnection,
  setDemandAndFilterForSending,
  getDemandsByFilter,
  updateDemand,
  deleteDemand,
  makeLogin,
};
