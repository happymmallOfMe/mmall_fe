require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
var _payment = require('service/payment-service.js');
var _mm = require('util/mm.js');
var templateIndex = require('./index.string');
// 页面逻辑部分
var page = {
    data: {
        orderNumber: _mm.getUrlParam('orderNumber')
    },
    init: function () {
        this.onLoad();
    },
    onLoad: function () {
        // 加载支付二维码页面
        this.loadPaymentInfo();
    },

    // 加载支付二维码页面
    loadPaymentInfo: function () {
        var _this = this,
            paymentHtml = '',
            $pageWrap = $('.page-wrap');
        // 呈现加载过程
        $pageWrap.html('<div class="loading"></div>');

        // 获取后端数据，并渲染页面
        _payment.getPaymentInfo(
            this.data.orderNumber,
            function (res) {
                // 结合后端响应数据和HTML模板渲染订单列表页
                paymentHtml = _mm.renderHtml(templateIndex, res);
                //将渲染后的页面加入HTML容器中
                $pageWrap.html(paymentHtml);
                _this.listenOrderStatus();
            },
            function (errMsg) {
                $pageWrap.html('<p class="err-tip">' + errMsg + '</p>');
            }
        );
    },

    // 监听订单状态，支付成功则页面跳转到支付成功页
    listenOrderStatus: function () {
        var _this = this;
        this.paymentTimer = window.setInterval(
            function () {
                _payment.getPaymentStatus(
                    _this.data.orderNumber,
                    function (res) {
                        if (res === true) {
                            window.location.href =
                                './result.html?type=payment&orderNumber=' + _this.data.orderNumber;
                        }
                    }
                )
            },
            5e3
        );
    }
};
$(function () {
    page.init();
});