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
    data: {
        username: '',
        question: '',
        answer: '',
        token: ''
    },
    init: function () {
        this.onLoad();
        this.bindEvent();
    },
    onLoad: function () {
        this.loadStepUsername();
    },
    bindEvent: function () {
        var _this = this;
        // 输入用户名后下一步按钮点击事件
        $('#submit-username').click(function () {
            var username = $.trim($('#username').val());

            // 用户名存在
            if (username) {
                _user.getQuestion(
                    username,
                    function (res) {
                        _this.data.username = username;
                        _this.data.question = res;
                        _this.loadStepQuestion()
                    },
                    function (errMsg) {
                        formError.show(errMsg);
                    }
                );
            }
            // 用户名不存在
            else {
                formError.show('请输入用户名');
            }
        });

        // 输入密码提示问题答案后下一步按钮点击事件
        $('#submit-question').click(function () {
            var answer = $.trim($('#answer').val());

            // answer存在
            if (answer) {
                _user.checkAnswer({
                    username: _this.data.username,
                    question: _this.data.question,
                    answer: answer
                    },
                    function (res) {
                        _this.data.answer = answer;
                        _this.data.token = res;
                        _this.loadStepPassword()
                    },
                    function (errMsg) {
                        formError.show(errMsg);
                    }
                );
            }
            // answer不存在
            else {
                formError.show('请输入密码提示问题答案');
            }
        });

        // 输入新密码后下一步按钮点击事件
        $('#submit-password').click(function () {
            var password = $.trim($('#password').val());
            var formData = {
                    username: _this.data.username,
                    passwordNew: password,
                    forgetToken: _this.data.token
                },
                validateResult = _this.formValidate(formData);
            // 验证成功
            if (validateResult.status) {
                // 提交新密码
                _user.forgetResetPassword(
                    formData,
                    function (res) {
                        window.location.href = './result.html?type=reset-pass';
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
        })
    },
    // step1：加载输入用户名
    loadStepUsername: function () {
        $('.step-username').show();
    },

    // step2：加载输入密码提示问题答案
    loadStepQuestion: function () {
        // 清除错误提示
        formError.hide();
        // 切换容器，并显示用户密码提示问题
        $('.step-username').hide()
            .siblings('.step-question').show()
            .find('.question').text(this.data.question);
    },

    // step3：加载输入新密码
    loadStepPassword: function () {
        // 清除错误提示
        formError.hide();
        // 切换容器，
        $('.step-question').hide()
            .siblings('.step-password').show();
    },

    // 验证密码格式
    formValidate: function (formData) {
        var result = {
            status: false,
            msg: ''
        };
        if (!_mm.validate(formData.passwordNew, 'require')) {
            result.msg = '密码不能为空';
            return result;
        }
        if (formData.passwordNew.length < 6) {
            result.msg = '密码长度不能少于6位';
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