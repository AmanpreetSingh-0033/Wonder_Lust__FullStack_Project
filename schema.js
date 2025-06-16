
//////////////////////////////    This is Joi validation schema which is used  to validaye the entered data from server side 

const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.object({
      url: Joi.string().uri().allow("", null).optional(),
      filename: Joi.string().allow("", null).optional()
    }).optional(),
    category: Joi.array()
      .items(Joi.string().valid(
        "Trending", "Rooms", "Farms", "Castels", "Play Station", "Wonder Land",
        "Pools", "City", "Hotels", "Kids", "Beaches", "Mountains", "Arctic", "Clubs"
      ))
      .min(1)
      .required()
  }).required()
});



module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    comment: Joi.string().required(),
    rating: Joi.number().min(0).max(5).required()
  }).required()
});
