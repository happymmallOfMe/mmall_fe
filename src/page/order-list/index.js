require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
var navSide = require('page/common/nav-side/index.js');
var _order = require('service/order-service.js');
var Pagination = require('util/pagination/index.js');
var _mm = require('util/mm.js');
var templateIndex = require('./index.string');
// 页面逻辑部分
var page = {
    data: {
      listParam: {
          pageNum: 1,
          pageSize: 10
      }
    },
    init: function () {
        this.onLoad();
    },
    onLoad: function () {
        // 初始化左侧导航菜单
        navSide.init({
            name: 'order-list'
        });

        // 加载订单列表
        this.loadOrderList();
    },
    // 加载订单列表
    loadOrderList: function () {
        var _this = this,
            orderListHtml = '',
            $listCon = $('.order-list-con');
        // 呈现加载过程
        $listCon.html('<div class="loading"></div>');

        // 获取后端数据，并渲染页面
        _order.getOrderList(
            this.data.listParam,
            function (res) {

                // 结合后端响应数据和HTML模板渲染订单列表页
                orderListHtml = _mm.renderHtml(templateIndex, res);
                //将渲染后的页面加入HTML容器中
                $listCon.html(orderListHtml);

                // 加载分页信息
                _this.loadPagination({
                    hasPreviousPage: res.hasPreviousPage,
                    prePage: res.prePage,
                    hasNextPage: res.hasNextPage,
                    nextPage: res.nextPage,
                    pageNum: res.pageNum,
                    pages: res.pages
                });
            },
            function (errMsg) {
                $listCon.html('<p class="err-tip">加载订单失败，请刷新后重试</p>')
            }
        );
    },

    // 加载分页信息
    loadPagination: function (pageInfo) {
        var _this = this;
        // 通过类封装组件，
        !this.pagination ? (this.pagination = new Pagination()) : '';
        this.pagination.render($.extend(
            {},
            pageInfo,
            {
                container: $('.pagination'),
                onSelectPage: function(pageNum) {
                    _this.data.listParam.pageNum = pageNum;
                    _this.loadOrderList();
                }
            }
        ));
    }

};
$(function () {
    page.init();
});