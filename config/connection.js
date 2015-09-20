exports.adapters = {
    memory: require('sails-memory'),
    mysql: require('sails-mysql'),
    //mongo: require('sails-mongo')
};

exports.connections = {
    memory: {
        adapter: 'memory'
    },
    mysql: {
        adapter: 'mysql',
        host: 'localhost',
        port: 3306,
        user: 'username',
        password: 'password',
        database: 'MySQL Database Name',
        charset: 'utf8'
    },
    //mongo: {
    //    adapter: 'mongo',
    //    host: 'ds039073.mongolab.com', // defaults to `localhost` if omitted
    //    port: 39073, // defaults to 27017 if omitted
    //    user: 'root', // or omit if not relevant
    //    password: 'root', // or omit if not relevant
    //    database: 'makemehere' // or omit if not relevant
    //}

}
