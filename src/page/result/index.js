/**
 * @author Huanyu
 * @date 2018/6/10
 */
require('./index.css');
require('page/common/nav-simple/index.js');
var _mm = require('util/mm.js');
$(function () {
    var type = _mm.getUrlParam('type') || 'default',
        $element = $('.' + type + '-success');

    // 针对支付成功后查看订单详情的操作
    if (type === 'payment') {
            // 获取已支付订单号
        var orderNumber = _mm.getUrlParam('orderNumber'),
            // 获取容器节点
            $orderNumber = $element.find('.order-number');
        // 更改容器的href(跳转页地址)属性，即在跳转地址上添加orderNumber的值
        $orderNumber.attr('href', $orderNumber.attr('href') + orderNumber);
    }

    // 显示对应的提示元素
    $element.show();
});
