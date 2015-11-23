var Waterline = require('waterline');
var Joi = require('joi');
var Warranty = require('../models/Warranty.js');

exports.Schema = Joi.object({
    id: Joi.number(),
    username: Joi.string(),
    email: Joi.string(),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
}).meta({className: 'User'});

exports.FullSchema = Joi.object({
    id: Joi.number(),
    username: Joi.string(),
    email: Joi.string(),
    warranties: Joi.array().items(Warranty.Schema),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
}).meta({className: 'User'});

exports.Collection = Waterline.Collection.extend({
    identity: 'user',
    connection: 'memory',
    schema: true,
    autoPK: false,
    migrate: 'alter',

    attributes: {
        id: {
            type: 'integer', primaryKey: true, unique: true, autoIncrement: true
        },
        email: {
            type: 'email', index: true, unique: true
        },
        username: {
            type: 'string', minLength: 2, maxLength: 20, index: true, unique: true
        },
        password: {
            type: 'string', required: true
        },
        warranties: {
            collection: 'warranty',
            via: 'owner'
        },

        toJSON: function () {
            var obj = this.toObject();
            delete obj.password;
            return obj;
        },
    },

    /**
     * Lifecycle Callbacks
     *
     * Run before and after various stages:
     *
     * beforeValidate
     * afterValidate
     * beforeUpdate
     * afterUpdate
     * beforeCreate
     * afterCreate
     * beforeDestroy
     * afterDestroy
     */
    beforeCreate: function (values, callback) {
        // An example encrypt function defined somewhere
        //encrypt(values.password, function (err, password) {
        //    if (err) return cb(err);
        //
        //    values.password = password;
        //cb();
        //});
        callback();
    },
});