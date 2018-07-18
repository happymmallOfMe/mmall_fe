require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
var navSide = require('page/common/nav-side/index.js');
var _order = require('service/order-service.js');
var _mm = require('util/mm.js');
var templateIndex = require('./index.string');
// 页面逻辑部分
var page = {
    data: {
        orderNumber: _mm.getUrlParam('orderNumber')
    },
    init: function () {
        this.onLoad();
        this.bindEvent();
    },
    onLoad: function () {
        // 初始化左侧导航菜单
        navSide.init({
            name: 'order-list'
        });

        // 加载订单列表
        this.loadDetail();
    },

    // 取消订单绑定事件
    bindEvent: function () {
        var _this = this;
        $(document).on('click', '.order-cancel', function () {
            if (window.confirm('确实要取消该订单吗？')) {
                _order.cancelOrder(
                    _this.data.orderNumber,
                    function (res) {
                        _mm.successTips('该订单取消成功');
                        _this.loadDetail();
                    },
                    function (errMsg) {
                        _mm.errorTips(errMsg);
                    }
                );
            }
        })
    },

    /**
     * 加载订单列表
     * 注意：res.后接的参数名称需与后端属性名称保持一致，渲染文件templateIndex中动态参数名称也需与后端属性名称保持一致。
     */
    loadDetail: function () {
        var _this = this,
            orderDetailHtml = '',
            $content = $('.content');
        // 呈现加载过程
        $content.html('<div class="loading"></div>');

        // 获取后端数据，并渲染页面
        _order.getOrderDetail(
            this.data.orderNumber,
            function (res) {
                _this.dataFiler(res);

                // 结合后端响应数据和HTML模板渲染订单列表页
                orderDetailHtml = _mm.renderHtml(templateIndex, res);
                //将渲染后的页面加入HTML容器中
                $content.html(orderDetailHtml);
            },
            function (errMsg) {
                $content.html('<p class="err-tip">' + errMsg + '</p>');
            }
        );
    },

    /**
     * 数据适配
     * 注意：status需与后端属性名称保持一致
     */
    dataFiler: function (data) {
        data.needPay = data.status === 10;
        data.isCancelable = data.status === 10;
    }
};
$(function () {
    page.init();
});