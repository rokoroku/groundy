var Joi = require('joi');
var Boom = require('boom');
var Warranty = require('../models/Warranty.js');

function getCollection(request) {
    return request.collections.warranty;
}

function getWarranties(request, reply) {

    var Warranties = getCollection(request);

    if (typeof request.params.limit === 'number') {
        reply(Warranties.find().limit(10));
    } else {
        reply(Warranties.find());
    }
}

function getWarrantyById(request, reply) {

    var Warranties = getCollection(request);

    Warranties.findOne(request.params.id)
        .populate('product')
        .populate('owner')
        .exec(function (err, warranty) {
            if (err) {
                reply(err)
            } else if (warranty) {
                reply(warranty);
            } else {
                reply(Boom.notFound('Warranty not found.'));
            }
        });
}

function createWarranty(request, reply) {

    var Warranties = getCollection(request);
    var payload = request.payload;

    Warranties.create(payload).exec(
        function (err, warranty) {
            if (err) {
                reply(err);
            } else {
                reply(warranty);
            }
        });
}

function updateWarranty(request, reply) {
    var Warranties = getCollection(request);
    var payload = request.payload;

    Warranties.update(request.params.id, payload)
        .exec(function (err, updatedWarranties) {
            if (err) {
                reply(err);
            } else {
                reply(updatedWarranties);
            }
        });
}

module.exports = [
    {
        method: 'GET',
        path: '/warranty/',
        config: {
            auth: 'default',
            tags: ['api', 'warranty'],
            description: 'Retrieve every warranties',
            plugins: {
                'hapi-swaggered': {
                    operationId: 'getWarranties',
                    responses: {
                        default: {
                            description: 'OK',
                            schema: Joi.array().items(Warranty.Schema)
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
            handler: getWarranties
        }
    },
    {
        method: 'GET',
        path: '/warranty/{id}',
        config: {
            tags: ['api'],
            auth: 'default',
            description: 'Retrieve specific warranty by id',
            plugins: {
                'hapi-swaggered': {
                    operationId: 'getWarrantyById',
                    responses: {
                        default: {
                            description: 'OK',
                            schema: Warranty.FullSchema
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
                    id: Joi.string().required().description("the warranty's id")
                },
            },
            handler: getWarrantyById
        }
    },
    {
        method: 'GET',
        path: '/warranty/byRedeemCode/{redeemCode}',
        config: {
            tags: ['api', 'warranty'],
            auth: 'default',
            description: 'Retrieve specific warranty by Redeem Code',
            plugins: {
                'hapi-swaggered': {
                    operationId: 'getWarrantyByRedeemCode',
                    responses: {
                        default: {
                            description: 'OK',
                            schema: Warranty.FullSchema
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
                    redeemCode: Joi.string().required().description("the redeem code issued by seller.")
                },
            },
            handler: getWarrantyById
        }
    },
    {
        method: 'POST',
        path: '/warranty/',
        config: {
            tags: ['api', 'warranty'],
            auth: 'default',
            description: 'Add a new warranty to the store',
            plugins: {
                'hapi-swaggered': {
                    operationId: 'addWarranty',
                    responses: {
                        default: {
                            description: 'OK',
                            schema: Joi.alternatives([
                                Warranty.Schema,
                                Joi.array().items(Warranty.Schema)
                            ])
                        },
                        400: {description: 'Bad Request'},
                        401: {description: 'Unauthorized'},
                        415: {description: 'Unsupported Media Type'},
                        500: {description: 'Internal Server Error'}
                    }
                }
            },
            validate: {
                payload: Warranty.Schema
                    .meta({className: 'Creating Warranty'})
                    .description('Fields needs to be created')
                    .required()
            },
            handler: createWarranty
        }
    },
    {
        method: 'PUT',
        path: '/warranty/{id}',
        config: {
            tags: ['api', 'warranty'],
            auth: 'default',
            description: 'Update an existing warranty',
            plugins: {
                'hapi-swaggered': {
                    operationId: 'updateWarranty',
                    responses: {
                        default: {
                            description: 'OK',
                            schema: Warranty.Schema
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
                    id: Joi.string().required().description("the warranty's id")
                },
                payload: Warranty.Schema
                    .meta({className: 'Updating Warranty'})
                    .description("Fields need to be updated")
                    .required()
            },
            handler: updateWarranty
        }
    }
];