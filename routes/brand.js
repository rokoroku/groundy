var Joi = require('joi');
var Boom = require('boom');
var Brand = require('../models/Brand.js');
var Product = require('../models/Product.js');

function getCollection(request) {
    return request.collections.brand;
}

function getProductCollection(request) {
    return request.collections.product;
}

function getBrands(request, reply) {

    var Brands = getCollection(request);

    if (typeof request.params.limit === 'number') {
        reply(Brands.find().limit(10));
    } else {
        reply(Brands.find());
    }
}

function getBrandById(request, reply) {

    var Brands = getCollection(request);

    Brands.findOne(Number(request.params.id))
        .populate('products')
        .exec(function (err, brand) {
            if (err) {
                reply(err)
            } else if (brand) {
                reply(brand);
            } else {
                reply(Boom.notFound('Brand not found.'));
            }
        });
}

function createBrand(request, reply) {

    var Brands = getCollection(request);
    var payload = request.payload;

    Brands.create(payload).exec(
        function (err, brand) {
            if (err) {
                reply(err);
            } else {
                reply(brand);
            }
        });
}

function updateBrand(request, reply) {
    var Brands = getCollection(request);
    var payload = request.payload;

    Brands.update(request.params.id, payload)
        .exec(function (err, updatedBrands) {
            if (err) {
                reply(err);
            } else {
                reply(updatedBrands);
            }
        });
}

function getProducts(request, reply) {

    var Products = getProductCollection(request);

    if (typeof request.params.limit === 'number') {
        reply(Products.find({ id: { 'startsWith': request.params.id }}).limit(request.params.limit));
    } else {
        reply(Products.find({ id: { 'startsWith': request.params.id }}));
    }
}

function getProductById(request, reply) {

    var Products = getProductCollection(request);
    var key = Product.GenerateKey(request.params.id, request.params.productId);

    Products.findOne(key)
        .populate('brand')
        .exec(function (err, product) {
            if (err) {
                reply(err)
            } else if (product) {
                //product.brand = brand
                reply(product);
            } else {
                reply(Boom.notFound("Product not found"))
            }
        });
}

function createProduct(request, reply) {

    var Products = getProductCollection(request);
    var payload = request.payload;
    var key = Product.GenerateKey(request.params.id, request.params.productId);
    payload.id = key;

    Products.create(payload).exec(
        function (err, product) {
            if (err) {
                reply(err);
            } else {
                reply(product);
            }
        });
}

function updateProduct(request, reply) {
    var Products = getProductCollection(request);
    var payload = request.payload;
    var key = Product.GenerateKey(request.params.id, request.params.productId);
    payload.id = key;

    Products.update(key, payload)
        .exec(function (err, updatedProducts) {
            if (err) {
                reply(err);
            } else {
                reply(updatedProducts);
            }
        });
}

module.exports = [
    {
        method: 'GET',
        path: '/brand/',
        config: {
            auth: 'default',
            tags: ['api', 'brand'],
            description: 'Retrieve every warranties',
            plugins: {
                'hapi-swaggered': {
                    operationId: 'getBrands',
                    responses: {
                        default: {
                            description: 'OK',
                            schema: Joi.array().items(Brand.Schema)
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
            handler: getBrands
        }
    },
    {
        method: 'GET',
        path: '/brand/{id}',
        config: {
            tags: ['api'],
            auth: 'default',
            description: 'Retrieve specific brand by id',
            plugins: {
                'hapi-swaggered': {
                    operationId: 'getBrandById',
                    responses: {
                        default: {
                            description: 'OK',
                            schema: Brand.FullSchema
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
                    id: Joi.string().required().description("the brand's id")
                },
            },
            handler: getBrandById
        }
    },
    {
        method: 'POST',
        path: '/brand/',
        config: {
            tags: ['api', 'brand'],
            auth: 'default',
            description: 'Add a new brand to the store',
            plugins: {
                'hapi-swaggered': {
                    operationId: 'addBrand',
                    responses: {
                        default: {
                            description: 'OK',
                            schema: Joi.alternatives([
                                Brand.Schema,
                                Joi.array().items(Brand.Schema)
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
                payload: Brand.Schema
                    .meta({className: 'Creating Brand'})
                    .description('Fields needs to be created')
                    .required()
            },
            handler: createBrand
        }
    },
    {
        method: 'PUT',
        path: '/brand/{id}',
        config: {
            tags: ['api', 'brand'],
            auth: 'default',
            description: 'Update an existing brand',
            plugins: {
                'hapi-swaggered': {
                    operationId: 'updateBrand',
                    responses: {
                        default: {
                            description: 'OK',
                            schema: Brand.Schema
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
                    id: Joi.string().required().description("the brand's id")
                },
                payload: Brand.Schema
                    .meta({className: 'Updating Brand'})
                    .description("Fields need to be updated")
                    .required()
            },
            handler: updateBrand
        }
    },
    {
        method: 'GET',
        path: '/brand/{id}/product/',
        config: {
            auth: 'default',
            tags: ['api', 'brand', 'product'],
            description: 'Retrieve every warranties',
            plugins: {
                'hapi-swaggered': {
                    operationId: 'getProducts',
                    responses: {
                        default: {
                            description: 'OK',
                            schema: Joi.array().items(Product.Schema)
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
                    id: Joi.string().required().description("the brand's id")
                },
                query: {
                    limit: Joi.number().description("the number want to retrieve")
                }
            },
            handler: getProducts
        }
    },
    {
        method: 'GET',
        path: '/brand/{id}/product/{productId}',
        config: {
            tags: ['api', 'brand', 'product'],
            auth: 'default',
            description: 'Retrieve specific product by id',
            plugins: {
                'hapi-swaggered': {
                    operationId: 'getProductById',
                    responses: {
                        default: {
                            description: 'OK',
                            schema: Product.FullSchema
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
                    id: Joi.string().required().description("the brand's id"),
                    productId: Joi.string().required().description("the product's id")
                }
            },
            handler: getProductById
        }
    },
    {
        method: 'POST',
        path: '/brand/{id}/product/',
        config: {
            tags: ['api', 'brand', 'product'],
            auth: 'default',
            description: 'Add a new product to the store',
            plugins: {
                'hapi-swaggered': {
                    operationId: 'addProduct',
                    responses: {
                        default: {
                            description: 'OK',
                            schema: Joi.alternatives([
                                Product.Schema,
                                Joi.array().items(Product.Schema)
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
                params: {
                    id: Joi.string().required().description("the brand's id")
                },
                payload: Product.Schema
                    .meta({className: 'Creating Product'})
                    .description('Fields needs to be created')
                    .required()
            },
            handler: createProduct
        }
    },
    {
        method: 'PUT',
        path: '/brand/{id}/product/{productId}',
        config: {
            tags: ['api', 'brand', 'product'],
            auth: 'default',
            description: 'Update an existing product',
            plugins: {
                'hapi-swaggered': {
                    operationId: 'updateProduct',
                    responses: {
                        default: {
                            description: 'OK',
                            schema: Product.Schema
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
                    id: Joi.string().required().description("the brand's id"),
                    productId: Joi.string().required().description("the product's id")
                },
                payload: Product.Schema
                    .meta({className: 'Updating Product'})
                    .description("Fields need to be updated")
                    .required()
            },
            handler: updateProduct
        }
    }
];
