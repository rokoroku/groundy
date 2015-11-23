var Joi = require('joi');
var Boom = require('boom');
var User = require('../models/User.js');

function generateToken(user) {
    return user.username;
}

function authenticate(request, reply) {
    var Users = request.collections.user;

    Users.findOne({username: request.payload.username})
        .exec(function (err, user) {
            if (err) {
                reply(err)
            } else if (user) {
                if (user.password === request.payload.password) {
                    reply({ access_token: generateToken(user) })
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
                            schema: Joi.object({
                                access_token: Joi.string()
                            })
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