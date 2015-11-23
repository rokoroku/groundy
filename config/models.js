exports.models = [
    require('../models/Brand.js').Collection,
    require('../models/Warranty.js').Collection,
    require('../models/Product.js').Collection,
    require('../models/User.js').Collection
];

exports.fixtures = [
    {
        model: 'user',
        items: [
            {id: 1, username: 'root', password: 'root', email: 'agsd@gmail.com'},
            {id: 2, username: '2번유저', password: 'asdgfs', email: 'agsd@yahoo.com'},
            {id: 3, username: '3번유저', password: 'asdgwqs', email: 'afdsf2@yahoo2.com'},
            {id: 4, username: '4번유저', password: 'asgdgss', email: 'gafg3@yahoo2.com'}
        ]
    },
    {
        model: 'brand',
        items: [
            {
                "id": 1,
                "name": "LLOYD",
                "tel": "123-456-7890",
                "location": "서울",
                "description": "몰라",
                "logoImage": "https://scontent-icn1-1.xx.fbcdn.net/hprofile-xlp1/v/t1.0-1/p320x320/10603442_619451671502733_5577087642403228963_n.jpg?oh=8526af766e0ca75004ed2d066824f72d&oe=56E215B4",
                "products": ["0_LPP15002G"]
            }
        ]
    },
    {
        model: 'product',
        items: [
            {
                "id": "1_LPP15002G",
                "productId": "LPP15002G",
                "brand": 1,
                "name": "ROSETTE",
                "image": "http://image.lloydgift.com/Product/201501/LPP15002G_1_396.jpg",
                "description": "중량	약 1.30g\n제조국: 베트남",
                "defaultWarrantyPeriod": 365
            }
        ]
    }
];
