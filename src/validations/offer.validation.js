const Joi = require('joi');

exports.createOfferSchema = Joi.object({

  type: Joi.string()
    .required(),

  quantity: Joi.number()
    .required(),


  cultivated_area: Joi.number()
    .required(),

  item_type: Joi.string()
    .required(),

  harvest_date: Joi.date()
    .required(),

  price: Joi.number()
    .required(),

  collection_location: Joi.string()
    .required(),

  description: Joi.string()
    .allow('')
    .optional(),

});


exports.updateOfferSchema = Joi.object({

  type: Joi.string(),

  quantity: Joi.number(),


  cultivated_area: Joi.number(),

  item_type: Joi.string(),

  harvest_date: Joi.date(),

  price: Joi.number(),

  collection_location: Joi.string(),

  description: Joi.string().allow(''),

});