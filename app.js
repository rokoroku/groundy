var Hapi = require('hapi');
var Database = require('./database.js');

var __package = require('./package.json');
var __routes = require('./config/routes');
var __models = require('./config/models');
var __fixtures = require('./config/fixtures');
var __connection = require('./config/connection');

var server = new Hapi.Server();

server.connection({
    port: process.env.PORT || 3000,
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
                    'warranty': 'Everything about Warranties',
                    'auth': 'Everything about Authentications'
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
                    defaultValue: 'developing_access_token',
                    placeholder: 'Enter your apiKey here'
                },
            }
        },
        {
            register: Database,
            options: {
                adapters: __connection.adapters,
                connections: __connection.connections,
                models: __models,
                fixtures: __fixtures
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
            if (token === 'developing_access_token') {
                callback(null, true, {token: token})
            } else {
                var AccessTokens = request.collections.access_token;
                AccessTokens.findOne(token)
                    .populate('user')
                    .exec(function (err, retrieved) {
                        if (retrieved && retrieved.isAlive()) {
                            request.user = retrieved.user;
                            callback(null, true, {token: token})
                        } else {
                            callback(null, false, {token: token})
                        }

                    });
            }
        }
    });
}

function startServer(server) {
    server.start(function () {
        console.log('Server running art:', server.info.uri);
    });
}