const Joi = require('joi');

exports.createShipmentSchema = Joi.object({
  type: Joi.string()
    .valid('pickup', 'delivery')
    .required(),

  related_type: Joi.string()
    .valid('purchase', 'sale')
    .required(),

  related_id: Joi.string()
    .uuid()
    .required(),

  driver_name: Joi.string()
    .required(),

  driver_phone: Joi.string()
    .required(),

  vehicle_type: Joi.string()
    .required(),

  plate_number: Joi.string()
    .required(),

  scheduled_date: Joi.date()
    .required()
});