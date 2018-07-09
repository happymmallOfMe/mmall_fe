/**
 * @author Huanyu
 * @date 2018/6/10
 */
var _mm = require('util/mm.js');
var _address = {

    // 获取用户地址列表
    getAddressList: function (resolve, reject) {
        _mm.request({
            url    : _mm.getServerUrl('/shipping/list.do'),
            data: {
                pageSize: 50
            },
            success: resolve,
            error  : reject
        })
    },

    // 新建用户收件地址
    save: function (addressInfo, resolve, reject) {
        _mm.request({
            url    : _mm.getServerUrl('/shipping/add.do'),
            data: addressInfo,
            success: resolve,
            error  : reject
        })
    },

    // 更新用户收件地址
    update: function (addressInfo, resolve, reject) {
        _mm.request({
            url    : _mm.getServerUrl('/shipping/update.do'),
            data: addressInfo,
            success: resolve,
            error  : reject
        })
    },

    // 删除收件人地址
    // todo 对于自己的项目慈湖接口地址实为delete.do
    deleteAddress: function (shippingId, resolve, reject) {
        _mm.request({
            url    : _mm.getServerUrl('/shipping/del.do'),
            data: {
                shippingId: shippingId
            },
            success: resolve,
            error  : reject
        })
    },

    // 获取收件人单条地址具体信息
    getAddress: function (shippingId, resolve, reject) {
        _mm.request({
            url    : _mm.getServerUrl('/shipping/select.do'),
            data: {
                shippingId: shippingId
            },
            success: resolve,
            error  : reject
        })
    },


};
module.exports = _address;