require('./index.css');
require('page/common/header/index.js');
var nav = require('page/common/nav/index.js');
var _mm = require('util/mm.js');
var _cart = require('service/cart-service.js');
var templateIndex = require('./index.string');

var page = {
    data: {
    },
    init: function () {
        this.onLoad();
        this.bindEvent();
    },
    onLoad: function () {
        this.loadCart();
    },

    // 加载购物车信息
    loadCart: function() {
        var _this = this,
            $pageWrap = $('.page-wrap');
        // 加载过程展示
        $pageWrap.html('<div class="loading"></div>');
        // 获取用户购物车列表
        _cart.getCartList(
            function (res) {
                _this.renderCart(res);
            },
            function (errMsg) {
                _this.showCartError();
            }
        )
    },

    renderCart: function (data) {
        // 过滤后端接口响应数据
        this.filter(data);
        // 缓存购物车信息
        this.data.cartInfo = data;
        // 结合模板和响应数据来渲染HTML
        var cartHtml = _mm.renderHtml(templateIndex, data);
        // 将已渲染的HTML放到HTML对应位置容器中
        $('.page-wrap').html(cartHtml);
        // 更新导航区域购物车模块商品数量
        nav.loadCartCount();
    },

    // 数据匹配：检验后端响应数据是否为空
    filter: function (data) {
        data.notEmpty = !!data.cartProductVoList.length;
    },

    bindEvent: function () {
        // 缓存this
        var _this = this;

        // 因为这里使用的异步接口获取数据来加载渲染页面的，
        // 故在页面一出来就绑定事件是绑定不上的，需要使用事件代理。

        // 1.选择或者取消选择商品功能实现
        $(document).on('click', '.cart-select', function () {
            // 获取用户购物车商品id
            var $this = $(this),
                // 注意：
                //      如果需要在类.cart-select元素的父级元素及祖宗元素中寻找类.cart-table的话，需要使用parents('')方法；
                //      如果只是在父级元素中寻找的话，需要使用parent('')方法。
                productId = $this.parents('.cart-table').data('product-id');
            // 选中该商品并向后端传递数据
            if ($this.is(':checked')) {
                _cart.selectProduct(
                    productId,
                    function (res) {
                        _this.renderCart(res);
                    },
                    function (errMsg) {
                        _this.showCartError();
                    }
                );
            }
            // 取消选中该商品并向后端传递数据
            else {
                _cart.unselectProduct(
                    productId,
                    function (res) {
                        _this.renderCart(res);
                    },
                    function (errMsg) {
                        _this.showCartError();
                    }
                );
            }
        });

        // 2.全择或者取消全选功能实现
        $(document).on('click', '.cart-select-all', function () {
            var $this = $(this);
            // 全选商品并向后端传递数据
            if ($this.is(':checked')) {
                _cart.selectAllProduct(
                    function (res) {
                        _this.renderCart(res);
                    },
                    function (errMsg) {
                        _this.showCartError();
                    }
                );
            }
            // 取消全选并向后端传递数据
            else {
                _cart.unselectAllProduct(
                    function (res) {
                        _this.renderCart(res);
                    },
                    function (errMsg) {
                        _this.showCartError();
                    }
                );
            }
        });

        // 3.购物车商品数量加减功能实现
        $(document).on('click', '.count-btn', function () {
            var $this = $(this),
                $pCount = $this.siblings('.count-input'),
                currCount = parseInt($pCount.val()),
                type = $this.hasClass('plus') ? 'plus' : 'minus',
                productId = $this.parents('.cart-table').data('product-id'),
                minCount = 1,
                maxCount = parseInt($pCount.data('max')),
                newCount = 0;
            if (type === 'plus') {
                if (currCount >= maxCount) {
                    _mm.errorTips('该商品数量已达到上限');
                    return;
                }
                newCount = currCount + 1;
            }
            else if (type === 'minus') {
                if (currCount <= minCount) {
                    return;
                }
                newCount = currCount - 1;
            }

            // 更新购物车商品数量，向后端传输数据
            _cart.updateProduct({
                    productId: productId,
                    count: newCount
                },
                function (res) {
                    _this.renderCart(res);
                },
                function (errMsg) {
                    _this.showCartError();
                }
            )
        });

        // 4.删除购物车中单个商品功能实现
        $(document).on('click', '.cart-delete', function () {
            if (window.confirm('确认要删除该商品？')) {
                var productId = $(this).parents('.cart-table').data('product-id');
                _this.deleteCartProduct(productId);
            }
        });

        // 5.删除购物车中已选中商品功能实现（删除选中）
        $(document).on('click', '.delete-selected', function () {
            if (window.confirm('确认要删除选中的商品？')) {
                var arrProductIds = [],
                    $selectedItem = $('.cart-select:checked');
                // 循环查找购物车中选中商品的id
                for (var i = 0, iLength = $selectedItem.length; i < iLength; i++) {
                    arrProductIds.push(
                        $($selectedItem[i]).parents('.cart-table').data('product-id')
                    );
                }
                // 如有多个商品被选中，则将获取的商品id用“，”拼接
                if (arrProductIds.length) {
                    _this.deleteCartProduct(arrProductIds.join(','));
                }
                else {
                    _mm.errorTips('您还没有选中要删除的商品');
                }
            }
        });

        // 6.购物车提交功能实现
        $(document).on('click', '.btn-submit', function () {
            // 总价大于0，则提交购物车
            if (_this.data.cartInfo && _this.data.cartInfo.cartTotalPrice > 0) {
                window.location.href = './order-confirm.html';
            }
            else {
                _mm.errorTips('请选择商品后再提交');
            }
        });
    },




    // 移除购物车指定商品，支持批量删除（productId使用“，”隔开），向后端传输数据
    deleteCartProduct: function (productIds) {
        var _this = this;
        _cart.deleteProduct(
            productIds,
            function (res) {
                _this.renderCart(res);
            },
            function (errMsg) {
                _this.showCartError();
            }
        );
    },

    // 错误信息显示
    showCartError: function () {
        $('.page-wrap').html('<p class="err-tip">哪里不对了，刷新试试吧</p>');
    }
};

$(function () {
    page.init();
});