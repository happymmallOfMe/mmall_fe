/**
 * @author Huanyu
 * @date 2018/6/22
 */
require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
var _product = require('service/product-service.js');
var _mm = require('util/mm.js');
var Pagination = require('util/pagination/index.js');
var templateIndex = require('./index.string');

var page = {
    /**
     * 注意：方法getUrlParam中的参数名称，需与后端命名保持一致。
     */
    data: {
        listParam: {
            keyword: _mm.getUrlParam('keyword') || '',
            categoryId: _mm.getUrlParam('categoryId') || '',
            orderBy: _mm.getUrlParam('orderBy') || 'default',
            pageNum: _mm.getUrlParam('pageNum') || 1,
            pageSize: _mm.getUrlParam('pageSize') || 20
        }
    },
    init: function () {
        this.onLoad();
        this.bindEvent();
    },
    onLoad: function () {
        this.loadList();
    },
    bindEvent: function () {
        // 缓存this
        var _this = this;
        // 商品排序的点击事件
        $('.sort-item').click(function () {
            var $this = $(this);
            _this.data.listParam.pageNum = 1;
            // 1.默认排序的处理
            if ($this.data('type') === 'default') {
                // 已经包含active的样式，无需做处理
                if ($this.hasClass('active')) {
                    return;
                }
                // 没有包含active的样式
                else {
                    $this.addClass('active').siblings('.sort-item').removeClass('active asc desc');
                    _this.data.listParam.orderBy = 'default';
                }
            }
            // 2.依据价格排序的处理
            else if ($this.data('type') === 'price') {
                $this.addClass('active').siblings('.sort-item').removeClass('active asc desc');
                if (!$this.hasClass('asc')) {
                    $this.addClass('asc').removeClass('desc');
                    _this.data.listParam.orderBy = 'price_asc';
                }
                else {
                    $this.addClass('desc').removeClass('asc');
                    _this.data.listParam.orderBy = 'price_desc';
                }
            }
            // 重新加载列表
            _this.loadList();
        })
    },
    // 加载list数据
    loadList: function() {
        var _this = this,
            listHtml = '',
            listParam = this.data.listParam,
            $pListCon = $('.p-list-con');
        $pListCon.html('<div class="loading"></div>');

        // 删除参数中多余的字段
        listParam.categoryId ? (delete listParam.keyword) : (delete listParam.categoryId);

        /**
         * 请求接口
         * 注意：res后所接属性名称需与后端命名保持一致，如有需要，渲染文件中也需如此。
         */
        _product.getProductList(
            listParam,
            function (res) {
                listHtml = _mm.renderHtml(templateIndex, {list: res.list});
                $pListCon.html(listHtml);
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
                _mm.errorTips(errMsg);
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
                    _this.loadList();
                }
            }
        ));
    }
};
$(function () {
    page.init();
});