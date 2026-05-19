const Joi = require('joi');

exports.createSaleSchema = Joi.object({
  factory_id: Joi.string()
    .uuid()
    .required(),

  request_id: Joi.string()
    .uuid()
    .required(),

  items: Joi.array()
    .items(
      Joi.object({
        inventory_id: Joi.string()
          .uuid()
          .required(),

        quantity: Joi.number()
          .positive()
          .required()
      })
    )
    .min(1)
    .required()
});