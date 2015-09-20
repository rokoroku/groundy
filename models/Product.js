var Waterline = require('waterline');
var Joi = require('joi');

var Product = Waterline.Collection.extend({
    identity: 'product',
    connection: 'memory',
    attributes: {
        id: {
            type: 'string',
            primaryKey: true
        },
        name: {
            type: 'string',
            required: true
        },
        image: {
            type: 'array',
        },
        brand: {
            model: 'brand',
            via: 'products'
        }
    }
});
module.exports = Product;