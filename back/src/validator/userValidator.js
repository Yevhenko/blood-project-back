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
    throw error;
  }
};

const setValidUser = Joi.object().keys({
  fullName: Joi.string()
    .min(1)
    .max(255)
    .required(),
  dateOfBirth: Joi.date().required(),
  phoneNumber: Joi.string()
    .min(9)
    .max(20)
    .required(),
  email: Joi.string()
    .email({ multiple: false, tlds: { allow: false } })
    .required(),
  bloodType: Joi.string()
    .valid('1', '2', '3', '4')
    .required(),
  rhesus: Joi.any().required(),
  locality: Joi.string()
    .min(1)
    .max(255)
    .required(),
  lastBeingDonor: Joi.date(),
  telegramId: Joi.number().required(),
});

const updateValidUser = Joi.object().keys({
  fullName: Joi.string()
    .min(1)
    .max(255)
    .required(),
  dateOfBirth: Joi.date().required(),
  phoneNumber: Joi.string()
    .min(9)
    .max(20)
    .required(),
  email: Joi.string()
    .email({ multiple: false, tlds: { allow: false } })
    .required(),
  bloodType: Joi.string()
    .valid('1', '2', '3', '4')
    .required(),
  rhesus: Joi.any().required(),
  locality: Joi.string()
    .min(1)
    .max(255)
    .required(),
  lastBeingDonor: Joi.date(),
  telegramId: Joi.number().required(),
});

module.exports = { setValidUser, updateValidUser, validateRequest };
