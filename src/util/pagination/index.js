/**
 * @author Huanyu
 * @date 2018/6/28
 */
require('./index.css');
var _mm = require('util/mm.js');
var templatePagination = require('./index.string');

var Pagination = function () {
    var _this = this;
    this.defaultOption = {
        container: null,
        pageNum: 1,
        pageRange: 3,
        onSelectPage: null
    };
    // 分页按钮点击事件的处理，使用委托而不是绑定事件
    $(document).on('click', '.pg-item', function () {
        var $this = $(this);
        // 对于active和disabled按钮点击，不做处理
        if ($this.hasClass('active') || $this.hasClass('disabled')) {
            return;
        }
        typeof _this.option.onSelectPage === 'function' ? _this.option.onSelectPage($this.data('value')) : null
    })

};

// 渲染分页组件
Pagination.prototype.render = function (userOption) {
    // 合并选项
    this.option = $.extend({}, this.defaultOption, userOption);
    // 判断容器是否为合法jQuery对象
    if (!(this.option.container instanceof jQuery)) {
        return;
    }
    // 判断是否只有一页
    if (this.option.pages <= 1) {
        return;
    }
    // 渲染分页内容
    this.option.container.html(this.getPaginationHtml());
};

//获取分页的HTML， |上一页| 1 2 3 4 =5= 6|下一页|  5/6
Pagination.prototype.getPaginationHtml = function () {
    var html = '',
        pageArray = [],
        start = this.option.pageNum - this.option.pageRange > 0 ?
            this.option.pageNum - this.option.pageRange : 1,
        end = this.option.pageNum + this.option.pageRange < this.option.pages ?
            this.option.pageNum + this.option.pageRange : this.option.pages;

    // 上一页按钮的功能实现
    pageArray.push({
        name: '上一页',
        value: this.option.prePage,
        disabled: !this.option.hasPreviousPage,
    });
    // 数字按钮的功能实现
    for (var i = start; i <= end; i++) {
        pageArray.push({
            name: i,
            value: i,
            active: (i === this.option.pageNum),
        });

    };
    // 下一页按钮的功能实现
    pageArray.push({
        name: '下一页',
        value: this.option.nextPage,
        disabled: !this.option.hasNextPage,
    });
    html = _mm.renderHtml(
        templatePagination,
        {
            pageArray: pageArray,
            pageNum: this.option.pageNum,
            pages: this.option.pages
        }
    );
    return html;
};
module.exports = Pagination;
