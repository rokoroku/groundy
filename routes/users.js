var Joi = require('joi');
var User = require('../models/User');
var userSchema = Joi.object({
    id: Joi.number(),
    username: Joi.string(),
    email: Joi.string(),
    createdAt: Joi.date(),
    updatedAt: Joi.date(),
}).meta({className: 'User'});

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
        } else {
            reply(user);
        }
    };

    console.log(populate);
    if (populate) {
        Users.findOne(request.params.id)
            .populate('followedBy')
            .populate('followingUser')
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

            var updateFollowing = false;
            if (payload.followingUser) {
                for (var i in payload.followingUser) {
                    var followId = Number(payload.followingUser[i]);
                    updatedUsers[0].followingUser.add(followId);
                    updateFollowing = true;
                }
            }

            if (payload.followingBrand) {
                for (var i in payload.followingBrand) {
                    var followId = Number(payload.followingBrand[i]);
                    updatedUsers[0].followingBrand.add(followId);
                    updateFollowing = true;
                }
            }

            if (updateFollowing) {
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
                    operationId: 'getUsers',
                    responses: {
                        default: {
                            description: 'OK',
                            schema: Joi.array().items(userSchema)
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
                    operationId: 'getUserById',
                    responses: {
                        default: {
                            description: 'OK',
                            schema: Joi.object({
                                id: Joi.number(),
                                username: Joi.string(),
                                email: Joi.string(),
                                followedBy: Joi.array().items(userSchema),
                                followingUser: Joi.array().items(userSchema),
                                createdAt: Joi.date(),
                                updatedAt: Joi.date(),
                            }).meta({className: 'User'})
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
                            schema: Joi.array().items(userSchema)
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
                    operationId: 'updateUser',
                    responses: {
                        default: {
                            description: 'OK',
                            schema: userSchema
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
                    followingUser: Joi.array(Joi.string()),
                    followingBrand: Joi.array(Joi.string()),
                }).meta({className: 'Updating User'}).description("Fields need to be updated").required()
            },
            handler: updateUser
        }
    }
];