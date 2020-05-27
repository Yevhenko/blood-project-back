const ageCheck = dob => {
  const now = new Date();
  return (+now - +dob) / 1000 / 60 / 60 / 24 / 365.25;
}
const dob = new Date("1989-10-29");

module.exports = { ageCheck }