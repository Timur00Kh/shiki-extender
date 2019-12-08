const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const jQuery = require('jquery');
const args = require('minimist')(process.argv.slice(2));

module.exports = {
    mode: args.mode || 'production',
    // mode: 'production',
    devtool: 'source-map',
    entry: {
        'js/main': path.join(__dirname, 'options',  'options.js'),
        'js/executable/altWatcher': path.join(__dirname, 'executable', "AltWhatcher", 'altWatcher.js'),
        'background': path.join(__dirname, 'background.js')
    },
    devServer: {
        contentBase: './dist',
        compress: true,
        port: 8000,
        allowedHosts: [
            'localhost:9000'
        ]
    },
    output: {
        filename: '[name]-bundle.js',
        path: path.resolve('../dist')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
                loader: 'file-loader'
            },
            { test: /\.styl$/, loader: 'style-loader!css-loader!stylus-loader' },
            {
                test: /\.scss$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        // new webpack.ProvidePlugin({
        //     $: jQuery,
        //     jQuery: jQuery,
        //     "window.jQuery": jQuery
        // }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        }),
        new BundleAnalyzerPlugin()
    ],
    resolve: {
        modules: [
            path.join(__dirname, 'executable'),
            path.join(__dirname, 'options'),
            path.join(__dirname, 'node_modules'),
        ],
    }
}