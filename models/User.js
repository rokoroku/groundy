var Waterline = require('waterline');

var Users = Waterline.Collection.extend({
    identity: 'user',
    connection: 'memory',
    schema: true,
    autoPK: false,
    migrate: 'alter',

    attributes: {
        id: {
            type: 'integer', primaryKey: true, unique: true, autoIncrement: true
        },
        email: {
            type: 'email', index: true, unique: true
        },
        username: {
            type: 'string', minLength: 2, maxLength: 20, index: true, unique: true
        },
        password: {
            type: 'string', required: true
        },

        followedBy: {
            collection: 'user',
            via: 'followingUser'
        },
        followingUser: {
            collection: 'user',
            via: 'followedBy'
        },

        ownBrand: {
            collection: 'brand',
            via: 'owners'
        },
        followingBrand: {
            collection: 'brand',
            via: 'followedBy'
        },

        toJSON: function () {
            var obj = this.toObject();
            delete obj.password;
            return obj;
        },

        /**
         * @param  {Object}   params
         *         => type ('user', 'brand') type of following object
         *         => id {Integer} id of the following object
         * @param  {Function} callback
         */
        follow: function (params, callback) {
            var type = params.type;
            var followIds = params.id;
            var changed = false;

            if (!type) {
                callback('Error: type must be provided.');
                return;
            }
            if (!followIds) {
                callback('Error: id must be provided.');
                return;
            }
            if (!callback || typeof callback !== 'function') {
                callback = function () {
                }
            }

            if (type === 'user') {
                for(var i in followIds) {
                    var followId = Number(followIds[i]);
                    if (followId !== this.id) {
                        this.followingUser.add(followId);
                        changed = true;
                    } else {
                        callback('don\'t follow yourself!');
                        return;
                    }
                }
            } else if (type === 'brand') {
                for(var i in followIds) {
                    var followId = Number(followIds[i]);
                    this.followingBrand.add(followId);
                    changed = true;
                }
            } else {
                callback('Error: cannot find corresponding object.');
                return;
            }

            if (changed) {
                //noinspection JSUnresolvedFunction
                this.save(function (err) {
                    callback(err !== null ? err.err : err);
                });
            } else {
                callback(null);
            }
        },

        unfollow: function (params, callback) {
            var type = params.type;
            var followId = params.id;
            var changed = false;

            if (!type) {
                callback('Error: type must be provided.');
                return;
            }
            if (!followId) {
                callback('Error: id must be provided.');
                return;
            }
            if (!callback || typeof callback !== 'function') {
                callback = function () {
                }
            }

            if (type === 'user') {
                if (followId !== this.id) {
                    this.followingUser.remove(followId);
                    changed = true;
                } else {
                    callback('Error: don\'t follow yourself!');
                    return;
                }
            } else if (type === 'brand') {
                this.followingBrand.remove(followId);
                changed = true;
            } else {
                callback('Error: cannot find corresponding object.');
                return;
            }

            if (changed) {
                //noinspection JSUnresolvedFunction
                this.save(function (err) {
                    callback(err !== null ? err.err : err);
                });
            } else {
                callback(null);
            }
        },

        getFollowerCount: function () {
            return Users.count().where({followedBy: this.id});
        }
    },

    /**
     * Lifecycle Callbacks
     *
     * Run before and after various stages:
     *
     * beforeValidate
     * afterValidate
     * beforeUpdate
     * afterUpdate
     * beforeCreate
     * afterCreate
     * beforeDestroy
     * afterDestroy
     */
    beforeCreate: function (values, callback) {
        // An example encrypt function defined somewhere
        //encrypt(values.password, function (err, password) {
        //    if (err) return cb(err);
        //
        //    values.password = password;
        //cb();
        //});
        callback();
    },
});

module.exports = Users;