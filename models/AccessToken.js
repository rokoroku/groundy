var Joi = require('joi');
var Waterline = require('waterline');
var crypto = require('crypto');

const TOKEN_LENGTH = 32;

function generateToken(callback) {
    crypto.randomBytes(TOKEN_LENGTH, function(ex, token) {
        if (ex) callback(ex);

        if (token) callback(null, token.toString('hex'));
        else callback(new Error('Problem when generating token'));
    });
}

exports.Schema = Joi.object({
    access_token: Joi.string(),
    user: Joi.number(),
    expiredAt: Joi.date()
}).meta({className: 'Access Token'});

exports.Collection = Waterline.Collection.extend({
    identity: 'access_token',
    connection: 'memory',
    schema: true,
    autoPK: false,
    autoCreatedAt: false,
    autoUpdatedAt: false,
    migrate: 'alter',

    attributes: {
        id: {
            type: 'string', primaryKey: true, unique: true
        },
        user: {
            model: 'user', required: true, unique: true
        },
        expiredAt: {
            type: 'date'
        },

        toJSON: function() {
            var obj = this.toObject()
            obj.access_token = obj.id;
            delete obj.id;
            return obj;
        },

        isAlive: function() {
            var date = new Date();
            return date < this.expiredAt
        }
    },

    beforeUpdate: function (values, next) {
        var date = new Date();
        date.setDate(date.getDate() + 7);

        values.expiredAt = date
        next()
    },

    beforeCreate: function (values, next) {
        var date = new Date();
        date.setDate(date.getDate() + 7);
        values.expiredAt = date;

        generateToken(function (err, token) {
            if (err) {
                return next(err);
            } else {
                values.id = token;
                next();
            }
        });
    },
});