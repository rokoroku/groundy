var Hapi = require('hapi');
var server = new Hapi.Server();

var Crypto = require('crypto');

var __package = require('./package.json');
var __models = require('./config/models');
var __routes = require('./config/routes');
var __connection = require('./config/connection');

var server = new Hapi.Server();

server.connection({
    port: 3000,
    host: 'localhost',
    labels: ['api']
});
server.register(
    [
        require('inert'),
        require('vision'),
        {
            /**
             * Hapi Swaggered
             * https://github.com/z0mt3c/hapi-swaggered
             */
            register: require('hapi-swaggered'),
            options: {
                tags: {
                    'user': 'Everything about Users',
                    'brand': 'Everything about Brands',
                    'product': 'Everything about Products',
                    'warranty': 'Everything about Warranties'
                },
                info: {
                    title: __package.name,
                    version: __package.version,
                    description: 'Powered by node, hapi, joi, hapi-swaggered, hapi-swaggered-ui and swagger-ui'
                },
            }
        },
        {
            /**
             * Hapi Swaggered UI
             * https://github.com/z0mt3c/hapi-swaggered-ui
             */
            register: require('hapi-swaggered-ui'),
            options: {
                title: __package.name,
                path: '/docs',
                swaggerOptions: {
                    docExpansion: 'list'
                },
                authorization: {
                    field: 'access_token',
                    scope: 'query', // header works as well
                    //valuePrefix: 'bearer ', // prefix incase
                    defaultValue: 'default_access_token',
                    placeholder: 'Enter your apiKey here'
                },
            }
        },
        {
            register: require('./database'),
            options: {
                adapters: __connection.adapters,
                connections: __connection.connections,
                models: __models.models,
                fixtures: __models.fixtures
            }
        },
        {
            register: require('hapi-auth-bearer-token')
        },
        {
            register: require('good'),
            options: {
                reporters: [
                    {
                        reporter: require('good-console'),
                        events: {
                            response: '*',
                            log: '*'
                        }
                    }
                ]
            }
        }
    ],
    function (err) {
        if (err) throw err;

        registerAuthStrategy(server);
        registerRoutes(server);

        startServer(server);

    }
);

function registerRoutes(server) {
    for (var i in __routes) {
        server.route(__routes[i]);
    }
}

function registerAuthStrategy(server) {
    server.auth.strategy('default', 'bearer-access-token', {
        allowQueryToken: true,              // optional, true by default
        allowMultipleHeaders: false,        // optional, false by default
        accessTokenName: 'access_token',    // optional, 'access_token' by default
        validateFunc: function (token, callback) {
            // For convenience, the request object can be accessed
            // from `this` within validateFunc.
            var request = this;

            // Use a real strategy here,
            // comparing with a token from your database for example
            if (token === 'default_access_token') {
                callback(null, true, {token: token})
            } else {
                callback(null, false, {token: token})
            }
        }
    });
}

function startServer(server) {
    server.start(function () {
        console.log('Server running art:', server.info.uri);
    });
}