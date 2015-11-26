var Joi = require('joi');
var Product = require('../models/Product.js');
var Waterline = require('waterline');

exports.Schema = Joi.object({
    id: Joi.number(),
    name: Joi.string(),
    tel: Joi.string(),
    location: Joi.string(),
    description: Joi.string(),
    logoImage: Joi.string(),
    brandImages: Joi.array().items(Joi.string()),
    createdAt: Joi.date(),
    updatedAt: Joi.date()
}).meta({className: 'Brand'});

exports.FullSchema = Joi.object({
    id: Joi.number(),
    name: Joi.string(),
    tel: Joi.string(),
    location: Joi.string(),
    description: Joi.string(),
    logoImage: Joi.string(),
    brandImages: Joi.array().items(Joi.string()),
    products: Joi.array().items(Product.Schema),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
}).meta({className: 'Brand'});

exports.Collection = Waterline.Collection.extend({
    identity: 'brand',
    connection: 'memory',
    attributes: {
        id: {
            type: 'integer',
            unique: true,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: 'string',
            minLength: 1,
            maxLength: 30
        },
        tel: {
            type: 'string'
        },
        location: {
            type: 'string'
        },
        description: {
            type: 'text'
        },
        logoImage: {
            type: 'string'
        },
        brandImages: {
            type: 'array'
        },
        products: {
            collection: 'product',
            via: 'brand'
        }
    }
});
