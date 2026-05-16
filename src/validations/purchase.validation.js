const Joi = require('joi');

exports.createPurchaseSchema =
  Joi.object({

    offer_id: Joi.string()
      .uuid()
      .required(),

    quantity: Joi.number()
      .required(),

    price: Joi.number()
      .required(),

  });