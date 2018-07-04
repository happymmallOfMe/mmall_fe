/**
 * @author Huanyu
 * @date 2018/6/10
 */
var _mm = require('util/mm.js');
var _cart = {
    // 获取购物车数量
    getCartCount: function (resolve, reject) {
        _mm.request({
            url    : _mm.getServerUrl('/cart/get_cart_product_count.do'),
            success: resolve,
            error  : reject
        })
    },

    // 添加商品到购物车
    addToCart: function (productInfo, resolve, reject) {
        _mm.request({
            url    : _mm.getServerUrl('/cart/add.do'),
            data: productInfo,
            success: resolve,
            error  : reject
        })
    },

    // 获取用户购物车列表
    getCartList: function (resolve, reject) {
        _mm.request({
            url    : _mm.getServerUrl('/cart/list.do'),
            success: resolve,
            error  : reject
        })
    },

    // 购物车中单个商品选中
    selectProduct: function (productId, resolve, reject) {
        _mm.request({
            url    : _mm.getServerUrl('/cart/select.do'),
            data: {
                productId: productId
            },
            success: resolve,
            error  : reject
        })
    },

    // 购物车中单个商品选中取消
    unselectProduct: function (productId, resolve, reject) {
        _mm.request({
            url    : _mm.getServerUrl('/cart/un_select.do'),
            data: {
                productId: productId
            },
            success: resolve,
            error  : reject
        })
    },

    // 购物车商品全选
    selectAllProduct: function (resolve, reject) {
        _mm.request({
            url    : _mm.getServerUrl('/cart/select_all.do'),
            success: resolve,
            error  : reject
        })
    },

    // 购物车商品全选取消
    unselectAllProduct: function (resolve, reject) {
        _mm.request({
            url    : _mm.getServerUrl('/cart/un_select_all.do'),
            success: resolve,
            error  : reject
        })
    },

    // 更新购物车商品数量
    updateProduct: function (productInfo, resolve, reject) {
        _mm.request({
            url    : _mm.getServerUrl('/cart/update.do'),
            data: productInfo,
            success: resolve,
            error  : reject
        })
    },

    // 移除购物车某个或多个商品
    deleteProduct: function (productIds, resolve, reject) {
        _mm.request({
            url    : _mm.getServerUrl('/cart/delete_product.do'),
            data: {
                productIds: productIds
            },
            success: resolve,
            error  : reject
        })
    },
};
module.exports = _cart;