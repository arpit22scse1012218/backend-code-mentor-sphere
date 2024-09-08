const Joi = require('joi');

module.exports.mentorSchema = Joi.object({
    mentor: Joi.object({
        mentor_name: Joi.string().required(),
        image: Joi.string().uri().required(), // Assuming the image will be a URL
        field: Joi.string().required(),
        email: Joi.string().email().required(),
        description: Joi.string().required()
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
})
