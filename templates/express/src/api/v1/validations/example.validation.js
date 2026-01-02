const Joi = require('joi');

const exampleSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional()
});

module.exports = { exampleSchema };