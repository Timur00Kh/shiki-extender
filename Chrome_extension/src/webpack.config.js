const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const args = require('minimist')(process.argv.slice(2));

module.exports = {
    mode: args.mode || 'development',
    devtool: 'source-map',
    entry: {
        'js/main': path.join(__dirname, 'options',  'options.js'),
        'js/executable/altWatcher': path.join(__dirname, 'executable', "AltWhatcher", 'altWatcher.js'),
        'background': path.join(__dirname, 'background.js')
    },
    devServer: {
        static: './dist',
        compress: true,
        port: 8000,
        allowedHosts: [
            'localhost:9000'
        ]
    },
    output: {
        filename: '[name]-bundle.js',
        path: path.resolve('../dist'),
        clean: true
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
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
                type: 'asset/resource'
            },
            { 
                test: /\.styl$/, 
                use: ['style-loader', 'css-loader', 'stylus-loader']
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        }),
        new BundleAnalyzerPlugin({
            analyzerMode: 'disabled'
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'public/index.html'),
                    to: path.resolve('../dist/index.html')
                },
                {
                    from: path.resolve(__dirname, 'manifest.json'),
                    to: path.resolve('../dist/manifest.json')
                },
                {
                    from: path.resolve(__dirname, 'libs'),
                    to: path.resolve('../dist/js')
                }
            ]
        })
    ],
    resolve: {
        modules: [
            path.join(__dirname, 'executable'),
            path.join(__dirname, 'options'),
            path.join(__dirname, 'node_modules'),
        ],
        alias: {
            'vue': 'vue/dist/vue.esm-bundler.js'
        }
    }
}