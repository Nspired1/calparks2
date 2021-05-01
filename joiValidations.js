const Joi = require("joi");

module.exports.parkSchema = Joi.object({
  park: Joi.object({
    title: Joi.string().required(),
    location: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number(),
  }),
});
