var Joi = require('joi');
var Boom = require('boom');
var AccessToken = require('../models/AccessToken.js');
var User = require('../models/User.js');

var crypto = require('crypto');
var TOKEN_LENGTH = 32;

function authenticate(request, reply) {
    var Users = request.collections.user;
    var AccessTokens = request.collections.access_token;

    Users.findOne({username: request.payload.username})
        .exec(function (err, user) {
            if (err) {
                reply(err)
            } else if (user) {
                if (user.authenticate(request.payload.password)) {
                    AccessTokens.destroy({user: user.id}).exec(function (err, removed) {
                        if (err) {
                            reply (err)
                        } else {
                            AccessTokens.create({user: user.id}).exec(function (err, created) {
                                if (err) {
                                    reply(err)
                                } else {
                                    reply(created)
                                }
                            })
                        }
                    })
                } else {
                    reply(Boom.unauthorized('Authorization Failed.'))
                }
            } else {
                reply(Boom.unauthorized('Authorization Failed.'))
            }
        });
}

module.exports = [
    {
        method: 'POST',
        path: '/auth/',
        config: {
            tags: ['api', 'auth'],
            description: 'Authenticate with user\'s credential',
            plugins: {
                'hapi-swaggered': {
                    operationId: 'authenticate',
                    responses: {
                        default: {
                            description: 'OK',
                            schema: AccessToken.Schema
                        },
                        400: {description: 'Bad Request'},
                        401: {description: 'Authorization Failed'},
                        500: {description: 'Internal Server Error'}
                    }
                }
            },
            validate: {
                payload: Joi.object({
                    username: Joi.string(),
                    password: Joi.string()
                }).meta({className: 'Authenticate Token'})
                    .description("User's credential")
                    .required()
            },
            handler: authenticate
        }
    }
];