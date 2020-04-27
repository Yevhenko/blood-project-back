const Joi = require('joi');

const validateRequest = (schema) => async (req, res, next) => {
  try {
    const { error } = schema.validate(req.body);

  if (error) {
    res.send('Validation Error');
    throw new Error(error);
  }

  return next();
  } catch (error) {
    console.error(error);
  }
}

const setValidDemand = Joi.object().keys({
  fullName: Joi.string().min(1).max(255).required(),
  phoneNumber: Joi.string().min(9).max(20).required(),
  bloodType: Joi.string().valid('1', '2', '3', '4').required(),
  rhesus: Joi.any().required(),
  locality: Joi.string().min(1).max(255).required(),
  reason: Joi.string().min(1).max(255).required(),
  userId: Joi.number().required(),
});

const updateValidDemand = Joi.object().keys({
  fullName: Joi.string().min(1).max(255).required(),
  phoneNumber: Joi.string().min(9).max(20).required(),
  bloodType: Joi.string().valid('1', '2', '3', '4').required(),
  rhesus: Joi.any().required(),
  locality: Joi.string().min(1).max(255).required(),
  reason: Joi.string().min(1).max(255).required(),
  userId: Joi.number().required(),
});

module.exports = { setValidDemand, updateValidDemand, validateRequest };
