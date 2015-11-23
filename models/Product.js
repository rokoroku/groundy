var Waterline = require('waterline');
var Joi = require('joi');

/**
 * Generates brandId_productId key
 *
 * @return {string}
 */
exports.GenerateKey = function(brandId, productId) {
    return String(brandId + '_' + productId);
};

exports.Schema = Joi.object({
    productId: Joi.string(),
    brandId: Joi.string(),
    name: Joi.string(),
    image: Joi.string(),
    description: Joi.string(),
    defaultWarrantyPeriod: Joi.number().description("Default warranty period in days. 0 is no warranty, -1 is unlimited warranty."),
}).meta({className: 'Product'});

exports.FullSchema = Joi.object({
    productId: Joi.string(),
    brand: Joi.object({
        brandId: Joi.number(),
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
            unique: true
        },
        productId: {
            type: 'string',
        },
        brand: {
            model: 'brand',
        },
        name: {
            type: 'string',
        },
        image: {
            type: 'string'
        },
        description: {
            type: 'string'
        },
        defaultWarrantyPeriod: {
            type: 'integer'
        }
    }
});
