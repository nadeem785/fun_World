const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const joi = BaseJoi.extend(extension)




module.exports.worldSchemas= joi.object({
    world:joi.object({
        name:joi.string().required().escapeHTML(),
        price:joi.number().required().min(0),
        description:joi.string().required().min(4).max(1000).escapeHTML(),
        //image:joi.string().uri().required(),
        location:joi.string().required().escapeHTML(),
        

    }).required(),
    deleteImages:joi.array()
})
module.exports.reviewSchemas=joi.object({
    review:joi.object({
        body:joi.string().required().min(2).escapeHTML(),
        rating:joi.number().required().min(1).max(5),
    })
})