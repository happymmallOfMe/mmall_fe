require('./index.css');
require('page/common/nav/index.js');
require('page/common/header/index.js');
var navSide = require('page/common/nav-side/index.js');
var _user = require('service/user-service.js');
var _mm = require('util/mm.js');
var templateIndex = require('./index.string');
// 页面逻辑部分
var page = {
    init: function () {
        this.onLoad();
    },
    onLoad: function () {
        navSide.init({
            name: 'user-center'
        });
        this.loadUserInfo()
    },
    // 加载用户信息，并填充
    loadUserInfo: function () {
        var userHtml = '';
        _user.getUserInfo(
            function (res) {
                userHtml = _mm.renderHtml(templateIndex, res);
                $('.panel-body').html(userHtml);
            },
            function (errMsg) {
                _mm.errorTips(errMsg);
            }
        )
    }
};
$(function () {
    page.init();
});