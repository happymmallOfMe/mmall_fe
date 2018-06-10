/**
 * @author Huanyu
 * @date 2018/6/10
 */
require('./index.css');
var _mm = require('util/mm.js');
// 通用页面头部
var header = {
    init: function () {
        this.bindEvent();
    },
    onLoad: function () {
        var keyword = _mm.getUrlParam('keyword');
        // keyword存在，则将其回填到输入框
        if (keyword) {
            $('#search-input').val(keyword);
        }
    },
    bindEvent: function () {
        var _this = this;
        // 点击搜索按钮之后，做搜索提交
        $('#search-btn').click(function () {
            _this.searchSubmit();
        });

        // 输入并点回车后，做搜索提交
        $('#search-input').keyup(function (e) {
            // 回车键的keyCode为13
            if (e.keyCode === 13) {
                _this.searchSubmit();
            }
        })
    },
    // 搜索的提交
    searchSubmit: function () {
        var keyword = $.trim($('#search-input').val());
        // 如果提交时有keyword，正常跳转到list页
        if (keyword) {
            window.location.href = './list.html?keyword=' + keyword;
        }
        // 如果keyword为空，则直接返回到首页
        else {
            _mm.goHome();
        }
    }
};
header.init();