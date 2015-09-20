exports.models = [
    require('../models/User.js'),
    require('../models/Brand.js'),
    require('../models/Product.js')
];

exports.fixtures = [
    {
        model: 'user',
        items: [
            {id: 1, username: 'root', password: 'as2df', email: 'agsd@gmail.com'},
            {id: 2, username: '2번유저', password: 'asdgfs', email: 'agsd@yahoo.com'},
            {id: 3, username: '3번유저', password: 'asdgwqs', email: 'afdsf2@yahoo2.com', followingUser: [1]},
            {id: 4, username: '4번유저', password: 'asgdgss', email: 'gafg3@yahoo2.com', followingUser: [2, 3]}
        ]
    }
];
