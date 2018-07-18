require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
var _mm = require('util/mm.js');
var _product = require('service/product-service.js');
var _cart = require('service/cart-service.js');
var templateIndex = require('./index.string');

var page = {
    /**
     * 注意方法getUrlParam中的参数为购物车商品id属性名称，需与后端命名保持一致。
     */
    data: {
        productId: _mm.getUrlParam('productId') || '',
    },
    init: function () {
        this.onLoad();
        this.bindEvent();
    },
    onLoad: function () {
        // 如果没有传productId参数，则自动跳回首页
        if (!this.data.productId) {
            _mm.goHome();
        }
        this.loadDetail();
    },

    // 加载商品详情数据
    loadDetail: function() {
        var _this = this,
            html = '',
            $pageWrap = $('.page-wrap');
        // 加载过程展示
        $pageWrap.html('<div class="loading"></div>');
        // 请求并展示detail信息
        _product.getProductDetail(
            this.data.productId, 
            function (res) {
                // 过滤detail的响应数据
                _this.filter(res);
                // 缓存detail的响应数据
                _this.data.detailInfo = res;
                // 结合模板和响应数据来渲染HTML
                html = _mm.renderHtml(templateIndex, res);
                // 将已渲染的HTML放到HTML对应位置容器中
                $pageWrap.html(html);
            },
            function (errMsg) {
                $pageWrap.html('<p class="err-tip">此商品太淘气，找不到了</p>');
            }
        )
    },

    bindEvent: function () {
        // 缓存this
        var _this = this;

        // 因为这里使用的异步接口获取数据来加载渲染页面的，
        // 故在页面一出来就绑定事件是绑定不上的，需要使用事件代理。

        // 1.图片预览，实现的功能：鼠标指针置于小图上，展示对应小图在主图位置上
        $(document).on('mouseenter', '.p-img-item', function () {
            var imageUrl = $(this).find('.p-img').attr('src');
            $('.main-img').attr('src', imageUrl);
        });
        // 2.购买数量加减逻辑实现
        $(document).on('click', '.p-count-btn', function () {
            var type = $(this).hasClass('plus') ? 'plus' : 'minus',
                $pCount = $('.p-count'),
                currCount = parseInt($pCount.val()),
                minCount = 1,
                maxCount = _this.data.detailInfo.stock || 1;
            if (type === 'plus') {
                $pCount.val(currCount < maxCount ? currCount + 1 : maxCount);
            }
            if (type === 'minus') {
                $pCount.val(currCount > minCount ? currCount - 1 : minCount);
            }
        });

        /**
         * 3.添加商品到购物车逻辑实现
         * 注意：购物车商品id与相应数量的属性名称分别为productId和count，需与后端命名保持一致，如有需要，渲染文件中也需如此。
         */
        $(document).on('click', '.cart-add', function () {
            _cart.addToCart(
                {
                    productId: _this.data.productId,
                    count: $('.p-count').val()
                },
                function (res) {
                    window.location.href = './result.html?type=cart-add';
                },
                function (errMsg) {
                    _mm.errorTips(errMsg);
                }
            )
        })
    },

    /**
     * 数据匹配：拆分小图地址字段为数组各项元素
     * 注意：商品小图集合名称为subImages，需与后端命名一致，如有需要，渲染文件中也需如此。
     * @param data 后端数据res
     */
    filter: function (data) {
        data.subImages = data.subImages.split(',');
    }

};
$(function () {
    page.init();
});