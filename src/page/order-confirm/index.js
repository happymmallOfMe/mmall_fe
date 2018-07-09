require('./index.css');
require('page/common/header/index.js');
require('page/common/nav/index.js');
var _mm = require('util/mm.js');
var _order = require('service/order-service.js');
var _address = require('service/address-service.js');
var _addressModal = require('./address-modal.js');
var templateAddress = require('./address-list.string');
var templateProduct = require('./product-list.string');

var page = {
    data: {
        selectedAddressId: null
    },
    init: function () {
        this.onLoad();
        this.bindEvent();
    },
    onLoad: function () {
        this.loadAddressList();
        this.loadProductList();
    },

    // 加载地址列表信息
    loadAddressList: function() {
        var _this = this;
        $('.address-con').html('<div class="loading"></div>');
        // 获取用户地址列表功能实现
        _address.getAddressList(
            function (res) {
                _this.addressFilter(res);
                var addressListHtml = _mm.renderHtml(templateAddress, res);
                $('.address-con').html(addressListHtml);
            },
            function (errMsg) {
                $('.address-con').html('<p class="err-tip">地址加载失败，请刷新后重试</p>');
            }
        )
    },

    // 处理地址列表中选中状态：使得地址区域更新后，保持选中地址不变，该地址已删除则除外
    addressFilter: function (data) {
        if (this.data.selectedAddressId) {
            var selectedAddressIdFlag = false;
            for (var i = 0, length = data.list.length; i < length; i++) {
                if (data.list[i].id === this.data.selectedAddressId) {
                    data.list[i].isActive = true;
                    selectedAddressIdFlag = true;
                }
            }
            // 如果以前选中的地址不在列表中，则将其删除
            if (!selectedAddressIdFlag) {
                this.data.selectedAddressId = null;
            }
        }
    },

    // 加载商品清单信息功能实现
    loadProductList: function() {
        var _this = this;
        $('.product-con').html('<div class="loading"></div>');
        // 获取用户地址列表
        _order.getProductList(
            function (res) {
                var productListHtml = _mm.renderHtml(templateProduct, res);
                $('.product-con').html(productListHtml);
            },
            function (errMsg) {
                $('.product-con').html('<p class="err-tip">商品信息加载失败，请刷新后重试</p>');
            }
        )
    },

    bindEvent: function () {
        // 缓存this
        var _this = this;

        // 因为这里使用的异步接口获取数据来加载渲染页面的，
        // 故在页面一出来就绑定事件是绑定不上的，需要使用事件代理。

        // 1.选择地址功能实现
        $(document).on('click', '.address-item', function () {
            $(this).addClass('active').siblings('.address-item').removeClass('active');
            _this.data.selectedAddressId = $(this).data('id');
        });

        // 2.订单提交功能实现
        $(document).on('click', '.order-submit', function () {
            var shippingId = _this.data.selectedAddressId;
            if (shippingId) {
                _order.createOrder(
                    {
                        shippingId: shippingId
                    },
                    function (res) {
                        window.location.href = './payment.html?orderNumber=' + res.orderNo;
                    },
                    function (errMsg) {
                        _mm.errorTips(errMsg);
                    }
                );
            }
            else {
                _mm.errorTips('请选择地址后再提交');
            }
        });

        // 3.添加地址功能实现
        $(document).on('click', '.address-add', function () {
            _addressModal.show({
                isUpdate: false,
                onSuccess: function () {
                    _this.loadAddressList();
                }
            });
        });

        // 4.编辑地址功能实现
        $(document).on('click', '.address-update', function (e) {
            e.stopPropagation();
            var shippingId = $(this).parents('.address-item').data('id');
            _address.getAddress(
                shippingId,
                function (res) {
                    _addressModal.show({
                        isUpdate: true,
                        data: res,
                        onSuccess: function () {
                            _this.loadAddressList();
                        }
                    });
                },
                function (errMsg) {
                    _mm.errorTips(errMsg);
                }
            );
        });

        // 5.删除地址功能实现
        $(document).on('click', '.address-delete', function (e) {
            e.stopPropagation();
            var shippingId = $(this).parents('.address-item').data('id');
            if (window.confirm('确认要删除改地址吗？')) {
                _address.deleteAddress(
                    shippingId,
                    function (res) {
                        _this.loadAddressList();
                    },
                    function (errMsg) {
                        _mm.errorTips(errMsg);
                    }
                )
            }
        });


    },
};

$(function () {
    page.init();
});