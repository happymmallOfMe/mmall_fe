/**
 * @author Huanyu
 * @date 2018/6/10
 */
var _mm = require('util/mm.js');
var _cart = {
    // 登出
    getCartCount: function (resolve, reject) {
        _mm.request({
            url    : _mm.getServerUrl('/cart/get_cart_product_count.do'),
            success: resolve,
            error  : reject
        })
    }
};
module.exports = _cart;