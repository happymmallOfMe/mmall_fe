var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');
/*环境变量的配置，dev online*/
var WEBPACK_ENV = process.env.WEBPACK_ENV || 'dev';
console.log(WEBPACK_ENV);

/*HTML模板的处理*/
/*获取html-webpack-plugin参数的方法*/
var getHtmlConfig = function (name, title) {
    return {
        template: './src/view/' + name + '.html',
        filename: 'view/' + name + '.html',
        title: title,
        inject: true,
        hash: true,
        chunks: ['common', name]
    }
}

var config = {
    entry: {
        'common': ['./src/page/common/index.js'],
        'index': ['./src/page/index/index.js'],
        'login': ['./src/page/login/index.js'],
        'result': ['./src/page/result/index.js'],
    },
    output: {
        filename: 'js/[name].js',
        path: './dist',
        publicPath: '/dist'

    },
    externals: {
        'jquery' : 'window.jQuery',
    },
    resolve: {
        alias: {
            node_modules   : __dirname + '/node_modules',
            util           : __dirname + '/src/util',
            page           : __dirname + '/src/page',
            service        : __dirname + '/src/service',
            image          : __dirname + '/src/image'
        }
    },
    plugins: [
        /*独立通用模块到js/base.js*/
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common',
            filename: 'js/base.js'
        }),
        /*把css单独打包到文件里*/
        new ExtractTextPlugin("css/[name].css"),
        /*HTML模板的处理*/
        new HtmlWebpackPlugin(getHtmlConfig('index', '首页')),
        new HtmlWebpackPlugin(getHtmlConfig('login', '用户登录')),
        new HtmlWebpackPlugin(getHtmlConfig('result', '操作结果'))
    ],
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader")
            },
            {
                test: /\.(gif|png|jpg|woff|svg|eot|ttf)\??.*$/,
                loader: 'url-loader?limit=100&name=/resource/[name].[ext]'
            },
            {
                test: /\.string$/,
                loader: 'html-loader'
            }
        ]

    }

};

if ('dev' === WEBPACK_ENV) {
    config.entry.common.push('webpack-dev-server/client?http://localhost:8088/');
}
module.exports = config;