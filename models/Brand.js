var Waterline = require('waterline');
var Joi = require('joi');

var Brand = Waterline.Collection.extend({
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

        locale: {
            type: 'string'
        },

        description: {
            type: 'text'
        },

        followedBy: {
            collection: 'user',
            via: 'followingBrand'
        },

        products: {
            collection: 'product',
            via: 'brand'
        },

        owners: {
            collection: 'user',
            via: 'ownBrand'
        }
    }
});

module.exports = Brand;