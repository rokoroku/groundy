var Joi = require('joi');
var Boom = require('boom');
var User = require('../models/User.js');

function getUsers(request, reply) {

    var Users = request.collections.user;
    if (typeof request.params.limit === 'number') {
        reply(Users.find().limit(10));
    } else {
        reply(Users.find());
    }
}

function getUserById(request, reply) {

    var Users = request.collections.user;
    var populate = request.query['populate'] === true;

    var callback = function (err, user) {
        if (err) {
            reply(err)
        } else if (user) {
            reply(user);
        } else {
            reply(Boom.notFound('User not found.'));
        }
    };

    console.log(populate);
    if (populate) {
        Users.findOne(request.params.id)
            .populate('warranties')
            .exec(callback);
    } else {
        Users.findOne(request.params.id)
            .exec(callback);
    }
}

function createUser(request, reply) {

    var Users = request.collections.user;
    var payload = request.payload;

    Users.create(payload).exec(function (err, user) {
        if (err) {
            reply(err);
            return;
        }
        reply(user);
    });
}

function updateUser(request, reply) {
    var Users = request.collections.user;
    var payload = request.payload;

    Users
        .update(request.params.id, payload)
        .exec(function (err, updatedUsers) {
            if (err) {
                reply(err);
                return;
            }

            var updateWarranties = false;
            if (payload.warranties) {
                for (var i in payload.warranties) {
                    var warrantyId = Number(payload.warranties[i]);
                    updatedUsers[0].warranties.add(warrantyId);
                    updateWarranties = true;
                }
            }

            if (updateWarranties) {
                updatedUsers[0].save(function (err) {
                    console.log(err);
                });
            }

            reply(updatedUsers);
        });
}

module.exports = [
    {
        method: 'GET',
        path: '/user/',
        config: {
            auth: 'default',
            tags: ['api', 'user'],
            description: 'Retrieve every users',
            plugins: {
                'hapi-swaggered': {
                    operationId: 'getWarranties',
                    responses: {
                        default: {
                            description: 'OK',
                            schema: Joi.array().items(User.Schema)
                        },
                        400: {description: 'Bad Request'},
                        401: {description: 'Unauthorized'},
                        404: {description: 'Object Not found'},
                        500: {description: 'Internal Server Error'}
                    }
                }
            },
            validate: {
                query: {
                    limit: Joi.number().description("the number want to retrieve")
                }
            },
            handler: getUsers
        }
    },
    {
        method: 'GET',
        path: '/user/{id}',
        config: {
            tags: ['api'],
            auth: 'default',
            description: 'Retrieve specific user by id',
            plugins: {
                'hapi-swaggered': {
                    operationId: 'getWarrantyById',
                    responses: {
                        default: {
                            description: 'OK',
                            schema: User.FullSchema
                        },
                        400: {description: 'Bad Request'},
                        401: {description: 'Unauthorized'},
                        404: {description: 'Object Not found'},
                        500: {description: 'Internal Server Error'}
                    }
                }
            },
            validate: {
                params: {
                    id: Joi.string().required().description("the user's id")
                },
                query: {
                    populate: Joi.boolean().default('true').description("whether populate following/followers or not")
                }
            },
            handler: getUserById
        }
    },
    {
        method: 'POST',
        path: '/user/',
        config: {
            tags: ['api', 'user'],
            auth: 'default',
            description: 'Add a new user to the store',
            plugins: {
                'hapi-swaggered': {
                    operationId: 'addUser',
                    responses: {
                        default: {
                            description: 'OK',
                            schema: Joi.array().items(User.Schema)
                        },
                        400: {description: 'Bad Request'},
                        401: {description: 'Unauthorized'},
                        415: {description: 'Unsupported Media Type'},
                        500: {description: 'Internal Server Error'}
                    }
                }
            },
            validate: {
                payload: Joi.object({
                    email: Joi.string().required(),
                    password: Joi.string().required(),
                    username: Joi.string().required(),
                }).meta({className: 'Creating User'}).description('Fields needs to be created').required()
            },
            handler: createUser
        }
    },
    {
        method: 'PUT',
        path: '/user/{id}',
        config: {
            tags: ['api', 'user'],
            auth: 'default',
            description: 'Update an existing user',
            plugins: {
                'hapi-swaggered': {
                    operationId: 'updateWarranty',
                    responses: {
                        default: {
                            description: 'OK',
                            schema: User.Schema
                        },
                        400: {description: 'Bad Request'},
                        401: {description: 'Unauthorized'},
                        404: {description: 'Object Not found'},
                        415: {description: 'Unsupported Media Type'},
                        500: {description: 'Internal Server Error'}
                    }
                }
            },
            validate: {
                params: {
                    id: Joi.string().required().description("the user's id")
                },
                payload: Joi.object({
                    email: Joi.string(),
                    password: Joi.string(),
                    username: Joi.string(),
                    warranties: Joi.array(Joi.string()),
                }).meta({className: 'Updating User'}).description("Fields need to be updated").required()
            },
            handler: updateUser
        }
    }
];