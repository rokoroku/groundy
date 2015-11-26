var Joi = require('joi');
var Crypto = require('crypto');
var Waterline = require('waterline');
var Warranty = require('../models/Warranty.js');

const SaltLength = 10;
function generateSalt(len) {
    var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ',
        setLen = set.length,
        salt = '';
    for (var i = 0; i < len; i++) {
        var p = Math.floor(Math.random() * setLen);
        salt += set[p];
    }
    return salt;
}
function md5(string) {
    return Crypto.createHash('md5').update(string).digest('hex');
}

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

        authenticate: function (password) {
            var salt = this.password.substr(0, SaltLength);
            var validHash = salt + md5(password + salt);
            return this.password === validHash;
        }
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
    beforeCreate: function (values, next) {
        var salt = generateSalt(SaltLength);
        var hash = md5(values.password + salt);
        values.password = salt + hash;
        next();
    },

    //beforeValidate: function(values, next) {
    //    if (values.warranties) {
    //        global.Collections.warranty.find()
    //            .where({id: values.warranties})
    //            .exec(function (err, response) {
    //                if (err) {
    //                    return next(err);
    //                }
    //                if (response.length !== values.warranties.length ) {
    //                    return next(new Error("Cannot find matching warranties"));
    //                }
    //                next();
    //        });
    //    }
    //},
    //
    //afterUpdate: function(values, next) {
    //    if (values.warranties !== null) {
    //        var Warranties = global.Collections.warranty;
    //        Warranties.find()
    //            .where({id: values.warranties})
    //            .exec(function (err, response) {
    //                if (err) {
    //                    return next(err);
    //                }
    //                var count = response.length;
    //                var handled = false;
    //                for (var i in response) {
    //                    response[i].owner = values.id;
    //                    Warranties.update(response[i].id, response[i])
    //                        .exec(function(err, updated) {
    //                            if (err) {
    //                                if (!handled) {
    //                                    handled = true;
    //                                    next(err)
    //                                }
    //                            } else if (--count == 0) {
    //                                if (!handled) {
    //                                    next();
    //                                }
    //                            }
    //                        })
    //                }
    //            });
    //    }
    //}
});