const Joi = require('joi'); 
const Role = require('../../utils/userRoles.utils');

exports.orderSchema = {
    create: Joi.object({
        user_id: Joi.number().allow(null),
        client_id: Joi.number().allow(null),
        phone_number: Joi.string().allow(null),
        status_id: Joi.number().allow(null),
        region_id: Joi.number().allow(null),
        activity_id: Joi.number().allow(null),
        program_id: Joi.number().allow(null),
        source_id: Joi.number().allow(null),
        company_id: Joi.number().allow(null),
        summa: Joi.number().allow(null),
        comment: Joi.string().allow(null)
    }),

    update: Joi.object({
        user_id: Joi.number().allow(null),
        client_id: Joi.number().allow(null),
        phone_number: Joi.string().allow(null),
        status_id: Joi.number().allow(null),
        region_id: Joi.number().allow(null),
        activity_id: Joi.number().allow(null),
        program_id: Joi.number().allow(null),
        source_id: Joi.number().allow(null),
        summa: Joi.number().allow(null),
        comment: Joi.string().allow(null)
    }),
}