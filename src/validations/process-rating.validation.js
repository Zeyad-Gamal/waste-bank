
const Joi = require('joi');

const createProcessRatingSchema = Joi.object({
  purchase_id: Joi.string()
    .uuid()
    .allow(null)
    .optional(),

  sale_id: Joi.string()
    .uuid()
    .allow(null)
    .optional(),

  rating: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .required(),

  comment: Joi.string()
    .max(1000)
    .allow('', null)
    .optional(),
}).custom((value, helpers) => {

  if (!value.purchase_id && !value.sale_id) {
    return helpers.error('any.custom');
  }

  if (value.purchase_id && value.sale_id) {
    return helpers.error('any.custom');
  }

  return value;

}, 'Process Rating Validation')
.messages({
  'any.custom':
    'Rating must be related to either a purchase or a sale, but not both',
});

module.exports = {
  createProcessRatingSchema,
};