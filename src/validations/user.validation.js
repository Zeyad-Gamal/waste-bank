const Joi = require('joi');

const updatePasswordSchema = Joi.object({
  current_password: Joi.string()
    .required(),

  new_password: Joi.string()
    .required(),
});

module.exports = {
  updatePasswordSchema,
};