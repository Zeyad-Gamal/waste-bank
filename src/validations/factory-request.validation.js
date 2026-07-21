const Joi = require('joi');

exports.createFactoryRequestSchema =
  Joi.object({

    category: Joi.string()
      .required(),

    quantity: Joi.number()
      .required(),



    max_price: Joi.number()
      .required(),

  });


  exports.updateFactoryRequestSchema =
  Joi.object({

    category: Joi.string(),

    quantity: Joi.number(),


    max_price: Joi.number(),

  });