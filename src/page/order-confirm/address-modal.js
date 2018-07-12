/**
 * @author Huanyu
 * @date 2018/7/5
 */
var _mm = require('util/mm.js');
var _cities = require('util/cities/index.js');
var _address = require('service/address-service.js');
var templateAddressModal = require('./address-modal.string');


var _addressModal = {
    show: function (option) {
        // option的绑定
        this.option = option;
        this.option.data = option.data || {};
        this.$modalWrap = $('.modal-wrap');
        // 渲染页面
        this.loadModal();
        // 绑定事件
        this.bindEvent();
    },

    loadModal: function () {
        // 绑定模板和后端响应数据，生成HTML
        var addressModalHtml = _mm.renderHtml(
            templateAddressModal,
            {
                isUpdate: this.option.isUpdate,
                data: this.option.data
            }
        );
        // 将渲染的HTML置于对应的HTML容器中
        this.$modalWrap.html(addressModalHtml);
        // 加载省份
        this.loadProvince();
    },

    bindEvent: function () {
        var _this = this;

        // 1.省市二级联动：省份改变后，改变对应城市选项
        this.$modalWrap.find('#receiver-province').change(function () {
            var selectedProvince = $(this).val();
            _this.loadCities(selectedProvince);
        });

        // 2.提交收货地址功能实现
        this.$modalWrap.find('.address-btn').click(function () {
            var receiverInfo = _this.getReceiverInfo(),
                isUpdate = _this.option.isUpdate;
            // 创建新地址，并且新地址验证通过
            if (!isUpdate && receiverInfo.status) {
                _address.save(
                    receiverInfo.data,
                    function (res) {
                        _mm.successTips('地址添加成功');
                        _this.hide();
                        // 判断方法调用处参数是否为一个函数，如果是，则回调方法调用处的onSuccess方法
                        typeof _this.option.onSuccess === 'function' && _this.option.onSuccess();
                    },
                    function (errMsg) {
                        _mm.errorTips(errMsg);
                    }
                )
            }
            // 更新地址，并且验证通过
            else if (isUpdate && receiverInfo.status) {
                _address.update(
                    receiverInfo.data,
                    function (res) {
                        _mm.successTips('地址修改成功');
                        _this.hide();
                        // 判断方法调用处参数是否为一个函数，如果是，则回调方法调用处的onSuccess方法
                        typeof _this.option.onSuccess === 'function' && _this.option.onSuccess();
                    },
                    function (errMsg) {
                        _mm.errorTips(errMsg);
                    }
                )
            }
            // 验证未通过
            else {
                _mm.errorTips(receiverInfo.errMsg || '好像哪里不对了')
            }
        });

        // 3.点击弹窗x或者蒙版区域，实现关闭弹窗功能
        this.$modalWrap.find('.close').click(function () {
            _this.hide();
        });
        // 为避免点击modal内容区关闭弹窗，需在.close类所在元素之前如.modal-container类所在元素上终止冒泡事件传递
        // 原因：在点击弹窗界面时，会发生事件冒泡，即就是，点击操作向上触发上级元素所绑定的事件
        // (即<div class="modal close">中的close所绑定的关闭弹窗事件)，为此在.modal-container类所在元素上终止冒泡事件传递
        // 详见address-modal.string文件
        this.$modalWrap.find('.modal-container').click(function (e) {
            e.stopPropagation();
        });
    },

    loadProvince: function () {
        var provinces = _cities.getProvinces() || [],
            $provinceSelect = this.$modalWrap.find('#receiver-province');
        $provinceSelect.html(this.getSelectOption(provinces));

        // 如果为更新地址操作，并且已有地址包含省份信息，做省份回填，并关联对应城市候选项
        if (this.option.isUpdate && this.option.data.receiverProvince) {
            $provinceSelect.val(this.option.data.receiverProvince);
            // 加载城市
            this.loadCities(this.option.data.receiverProvince);
        }
        // 否则即为新建地址，调用loadCities方法渲染城市选项框
        else {
            this.loadCities();
        }
    },

    loadCities: function (provinceName) {
        var cities = _cities.getCities(provinceName),
            $citySelect = this.$modalWrap.find('#receiver-city');
        $citySelect.html(this.getSelectOption(cities));

        // 如果为更新地址操作，并且已有地址包含城市信息，做城市回填,
        if (this.option.isUpdate && this.option.data.receiverCity) {
            $citySelect.val(this.option.data.receiverCity);
        }
    },

    // 获取select框的选项，输入：array；输出：HTML
    getSelectOption: function (optionArray) {
        var html = '<option value="">请选择</option>';
        for (var i = 0, length = optionArray.length; i < length; i++) {
            html += '<option value="' + optionArray[i] +'">' + optionArray[i] + '</option>';
        }
        return html;
    },

    // 获取表单收件人信息，并做表单验证
    getReceiverInfo: function () {
        var receiverInfo = {},
            result = {
                status: false
            };
        receiverInfo.receiverName = $.trim(this.$modalWrap.find('#receiver-name').val());
        receiverInfo.receiverProvince = $.trim(this.$modalWrap.find('#receiver-province').val());
        receiverInfo.receiverCity = $.trim(this.$modalWrap.find('#receiver-city').val());
        receiverInfo.receiverAddress = $.trim(this.$modalWrap.find('#receiver-address').val());
        receiverInfo.receiverPhone = $.trim(this.$modalWrap.find('#receiver-phone').val());
        receiverInfo.receiverZip = $.trim(this.$modalWrap.find('#receiver-zip').val());

        // 修改收件人地址时，需要获取地址id，以便传递到后端数据库进行修改
        if (this.option.isUpdate) {
            receiverInfo.id = $.trim(this.$modalWrap.find('#receiver-id').val());
        }
        // 表单验证
        if (!receiverInfo.receiverName) {
            result.errMsg = '请输入用户名信息';
        }
        else if (!receiverInfo.receiverProvince) {
            result.errMsg = '请选择收件人所在省份';
        }
        else if (!receiverInfo.receiverCity) {
            result.errMsg = '请输入收件人所在城市';
        }
        else if (!receiverInfo.receiverAddress) {
            result.errMsg = '请输入收件人详细地址';
        }
        else if (!receiverInfo.receiverPhone) {
            result.errMsg = '请输入收件人手机号码';
        }
        else {
            result.status =true;
            result.data = receiverInfo;
        }
        return result;
    },

    // 关闭弹窗
    hide: function () {
        this.$modalWrap.empty();
    },
};
module.exports = _addressModal;