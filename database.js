/**
 * Created by rok on 2015. 9. 14..
 * Originally from DogWater lib.
 */
var Hoek = require('hoek');
var Items = require('items');
var Waterline = require('waterline');
var WaterlineFixtures = require('waterline-fixtures');

exports.register = function (server, options, next) {

    // Models come in as an array or a path to be required
    Hoek.assert(Array.isArray(options.models) || typeof options.models === 'string',
        'Model definitions need to be specified as an array or path to be required.');

    var models;
    if (Array.isArray(options.models)) {
        models = options.models;
    }

    // Here's the ORM!
    var waterline = new Waterline();

    // Give the models to waterline
    for (var i = 0; i < models.length; i++) {
        waterline.loadCollection(models[i]);
    }

    // Require the adapters modules if strings are passed instead of objects
    var keys = Object.keys(options.adapters);
    for (var j = 0; j < keys.length; j++) {
        if (typeof options.adapters[keys[j]] === 'string') {
            options.adapters[keys[j]] = require(options.adapters[keys[j]]);
        }
    }

    // Now init using the proper config and expose the model to hapi
    waterline.initialize({
        connections: options.connections,
        adapters: options.adapters
    }, function (err, ontology) {

        if (err) {
            return next(err);
        }

        // Expose public objects from the ORM
        server.expose('collections', ontology.collections);
        server.expose('connections', ontology.connections);
        server.expose('schema', waterline.schema);

        // Decorate server with the raw ORM
        server.decorate('server', 'waterline', waterline);

        // Decorate request with collections so they can be used in extensions easily
        server.decorate('request', 'collections', ontology.collections);

        // Expose an all-connections teardown method
        server.expose('teardown', function (cb) {

            var teardowns = [];

            var connection;
            var teardown;
            var connectionNames = Object.keys(ontology.connections);
            for (var k = 0; k < connectionNames.length; ++k) {

                connection = ontology.connections[connectionNames[k]];
                teardown = connection._adapter.teardown;

                if (typeof teardown === 'function' &&
                    teardowns.indexOf(teardown) === -1) {
                    teardowns.push(teardown);
                }

            }

            var run = function (item, done) {
                return item(done);
            };

            Items.parallel(teardowns, run, cb);

        });

        // Are there fixtures?
        if (options.fixtures) {

            // Load fixtures then have dogwater
            var fixturesOptions = {
                collections: ontology.collections
            };

            // If the option is an array, assume those are the fixtures themselves
            if (Array.isArray(options.fixtures)) {
                fixturesOptions.fixtures = options.fixtures;
            } else {
                Hoek.merge(fixturesOptions, options.fixtures);
            }

            WaterlineFixtures.init(fixturesOptions, next);
        } else {

            // Have dogwater
            next();
        }

    });

};

exports.register.attributes = {
    pkg: require('./package.json')
};