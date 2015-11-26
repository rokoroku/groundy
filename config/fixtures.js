/**
 * Created by rok on 2015. 11. 26..
 */
module.exports = [
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
                "description": "Gift for you",
                "logoImage": "https://scontent-icn1-1.xx.fbcdn.net/hprofile-xlp1/v/t1.0-1/p320x320/10603442_619451671502733_5577087642403228963_n.jpg?oh=8526af766e0ca75004ed2d066824f72d&oe=56E215B4",
                "products": ["1_LPP15002G"]
            },
            {
                "id": 2,
                "name": "OST",
                "tel": "02-2224-6324",
                "location": "서울특별시 강동구 천호동",
                "description": "시계/귀금속소매-종합",
                "logoImage": "http://image.fi.co.kr/ImgData/320/9653_1_659.jpg",
                "products": ["2_LPP15002G"]
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
            },
            {
                "id": "2_0TC102510FS",
                "productId": "0TC102510FS",
                "brand": 2,
                "name": "손목시계",
                "image": "http://timg.danawa.com/prod_img/500000/272/885/img/1885272_1.jpg",
                "description": "메탈 / 아날로그",
                "defaultWarrantyPeriod": 365
            },
            {
                "id": "3_BO5X38025H",
                "productId": "BO5X38025H",
                "brand": 3,
                "name": "카키 여성 하이넥 블루종 다운",
                "image": "http://img.ssfshop.com/goods/BPBR/15/11/18/GM0015111859705_0_477x630.jpg",
                "description": "빈폴아웃도어의 여성 블루종 다운입니다. 트렌디한 봄버 스타일의 다운 점퍼로 발수 기능과 대전 방지 가공 처리 소재를 사용해 기능성을 더한 활용도 높은 아우터입니다. 카라 부분 양털을 패치하고 소매와 밑단 리브 배색으로 여성스러움을 더한 제품입니다. 충전재: 거위솜털 80%, 거위깃털 20%.",
                "defaultWarrantyPeriod": 365
            },
        ]
    },
    {
        model: 'warranty',
        items: [
            {
                "id": "APXAVN2572",
                "product": "1_LPP15002G",
                "sellerName": "LLOYD 동대점",
                "sellerTel": "010-316-3624",
                "sellerLocation": "충무로",
                "memo": "방문구매",
                "purchaseDate": "2015-11-26T13:19:03.517Z",
                "expirationDate": "2016-11-26T13:19:03.517Z"
            },
            {
                "id": "BEANPOLE1211",
                "product": "3_BO5X38025H",
                "sellerName": "삼성물산 패션공식몰",
                "sellerTel": "1599-0007",
                "sellerLocation": "서울특별시 강남구 도곡동 467-12",
                "memo": "사업자 등록번호 101-85-43600 대표 윤주화",
                "purchaseDate": "2015-11-27T13:19:03.517Z",
                "expirationDate": "2016-11-27T13:19:03.517Z"
            }
        ]
    }

];
