const Joi = require('joi'); 
const Role = require('../../utils/userRoles.utils');

exports.clientSchema = {
    create: Joi.object({
        fullname: Joi.string().min(3).max(50).message('Ism noto\'g\'ri kiritildi'),
        phone_number: Joi.string().required(),
        region_id: Joi.number(),
        activity_id: Joi.number()

    }),

    update: Joi.object({
        fullname: Joi.string().min(3).max(50).message('Ism noto\'g\'ri kiritildi'),
        phone_number: Joi.string(),
        region_id: Joi.number(),
        activity_id: Joi.number()
    }),
}