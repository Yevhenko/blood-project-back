const messageWithDemand = dem => {
  return `🆕 

Група крові: ${dem.bloodType}
Резус-фактор: ${dem.rhesus}
Місто: ${dem.locality}
Мета: ${dem.reason}`
};

module.exports = { messageWithDemand };
