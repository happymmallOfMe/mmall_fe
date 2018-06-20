require('./index.css');
require('page/common/nav-simple/index.js');
var _user = require('service/user-service')
var _mm = require('util/mm.js');
// 表单中的错误提示
var formError = {
    show: function (errMsg) {
        $('.error-item').show().find('.err-msg').text(errMsg);
    },

    hide: function () {
        $('.error-item').hide().find('.err-msg').text('');
    }
};

// 页面逻辑部分
var page = {
    init: function () {
        this.bindEvent();
    },
    bindEvent: function () {
        var _this = this;
        // 异步验证username是否已存在
        $('#username').blur(function () {
            var username = $.trim($(this).val());
            if (!username) {
                return;
            }
            _user.checkUsername(
                username,
                function (res) {formError.hide()},
                function (errMsg) {formError.show(errMsg)}
            );

        });
        // 注册按钮的点击事件
        $('#submit').click(function () {
            _this.submit();
        });
        // 点击回车键提交，回车键的keyCode为13
        $('.user-content').keyup(function (e) {
            if (e.keyCode === 13) {
                _this.submit();
            }
        })
    },
    // 提交表单
    submit: function () {
        var formData = {
            username: $.trim($('#username').val()),
            password: $.trim($('#password').val()),
            passwordConfirm: $.trim($('#password-confirm').val()),
            phone: $.trim($('#phone').val()),
            email: $.trim($('#email').val()),
            question: $.trim($('#question').val()),
            answer: $.trim($('#answer').val())
        },
            validateResult = this.formValidate(formData);
        // 验证成功
        if (validateResult.status) {
            // 提交
            _user.register(
                formData,
                function (res) {
                    window.location.href = './result.html?type=register';
                },
                function (errMsg) {
                    formError.show(errMsg);
                }
            )
        }
        // 验证失败
        else {
            // 错误提示
            formError.show(validateResult.msg);
        }
    },

    formValidate: function (formData) {
        var result = {
            status: false,
            msg: ''
        };
        if (!_mm.validate(formData.username, 'require')) {
            result.msg = '用户名不能为空';
            return result;
        }
        if (!_mm.validate(formData.password, 'require')) {
            result.msg = '密码不能为空';
            return result;
        }
        if (formData.password.length < 6) {
            result.msg = '密码长度不能少于6位';
            return result;
        }
        if (formData.password !== formData.passwordConfirm) {
            result.msg = '两次输入的密码不一致';
            return result;
        }
        if (!_mm.validate(formData.phone, 'phone')) {
            result.msg = '手机号格式不正确';
            return result;
        }
        if (!_mm.validate(formData.email, 'email')) {
            result.msg = '邮箱格式不正确';
            return result;
        }
        if (!_mm.validate(formData.question, 'require')) {
            result.msg = '密码提示问题不能为空';
            return result;
        }
        if (!_mm.validate(formData.answer, 'require')) {
            result.msg = '密码提示问题答案不能为空';
            return result;
        }
        // 通过验证，返回正确提示
        result.status = true;
        result.msg = '验证通过';
        return result;
    }
};
$(function () {
    page.init();
});