const Joi = require("joi");

//file is called joiValidations, though this is joi Validations SCHEMA. Validation code is in app.js file,
// but named this file joiValidations to avoid confusion with schema files in models.

module.exports.parkSchema = Joi.object({
  park: Joi.object({
    title: Joi.string().required(),
    location: Joi.string().required(),
    images: Joi.string(),
    description: Joi.string().required(),
    price: Joi.number(),
  }).required(),
  deleteImages: Joi.array(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required(),
  }), //.required(),
});
