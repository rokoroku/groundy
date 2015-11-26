var Joi = require('joi');
var Waterline = require('waterline');

/**
 * Generates brandId_productId key
 *
 * @return {string}
 */
exports.GenerateKey = function(brandId, productId) {
    return String(brandId + '_' + productId);
};

exports.Schema = Joi.object({
    id: Joi.string().required(),
    brand: Joi.number().required(),
    name: Joi.string().required(),
    image: Joi.string(),
    description: Joi.string(),
    defaultWarrantyPeriod: Joi.number().description("Default warranty period in days. 0 is no warranty, -1 is unlimited warranty."),
    createdAt: Joi.date(),
    updatedAt: Joi.date()
}).meta({className: 'Product'});

exports.FullSchema = Joi.object({
    id: Joi.string(),
    brand: Joi.object({
        id: Joi.number(),
        name: Joi.string(),
        tel: Joi.string(),
        location: Joi.string(),
        description: Joi.string(),
        logoImage: Joi.string(),
        brandImages: Joi.array().items(Joi.string())
    }).meta({className: 'Brand'}),
    name: Joi.string(),
    image: Joi.string(),
    description: Joi.string(),
    defaultWarrantyPeriod: Joi.number().description("Default warranty period in days. 0 is no warranty, -1 is unlimited warranty."),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
}).meta({className: 'Product'});

exports.Collection = Waterline.Collection.extend({
    identity: 'product',
    connection: 'memory',
    attributes: {
        id: {
            type: 'string',
            primaryKey: true,
            unique: true,
            required: true
        },
        productId: {
            type: 'string',
            required: true
        },
        brand: {
            model: 'brand',
            required: true
        },
        name: {
            type: 'string',
            required: true
        },
        image: {
            type: 'string'
        },
        description: {
            type: 'string'
        },
        defaultWarrantyPeriod: {
            type: 'integer'
        },

        toJSON: function () {
            var obj = this.toObject();
            obj.id = obj.productId;
            delete obj.productId;
            return obj;
        },

        beforeValidate: function (values, next) {
            if (values.id !== null && values.brand !== null) {
                values.productId = values.id;
                values.id = values.brand + "_" + values.productId;
            }
            next()
        }
    }

});
