var Waterline = require('waterline');
var Joi = require('joi');
var Product = require('../models/Product.js');

exports.Schema = Joi.object({
    id: Joi.string(),
    ownerId: Joi.string().optional(),
    productId: Joi.string(),
    sellerName: Joi.string(),
    sellerTel: Joi.string(),
    sellerLocation: Joi.string(),
    memo: Joi.string(),
    purchaseDate: Joi.date(),
    expirationDate: Joi.date(),
}).meta({className: 'Warranty'});

exports.FullSchema = Joi.object({
    id: Joi.string(),
    owner: Joi.object({
        id: Joi.number(),
        username: Joi.string(),
        email: Joi.string(),
        createdAt: Joi.date(),
        updatedAt: Joi.date(),
    }).meta({className: 'User'}),
    product: Product.Schema,
    sellerName: Joi.string(),
    sellerTel: Joi.string(),
    sellerLocation: Joi.string(),
    memo: Joi.string(),
    purchaseDate: Joi.date(),
    expirationDate: Joi.date(),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
}).meta({className: 'Warranty'});

exports.Collection = Waterline.Collection.extend({
    identity: 'warranty',
    connection: 'memory',
    attributes: {
        id: {
            type: 'string',
            primaryKey: true
        },

        product: {
            model: 'product',
        },
        owner: {
            model: 'user'
        },

        sellerName: {
            type: 'string'
        },
        sellerTel: {
            type: 'string'
        },
        sellerLocation: {
            type: 'string'
        },
        memo: {
            type: 'string'
        },

        purchaseDate: {
            type: 'date'
        },
        expirationDate: {
            type: 'date'
        }
    }
});
