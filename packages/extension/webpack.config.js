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
        'js/main': path.join(__dirname, 'src', 'options', 'options.js'),
        'js/executable/altWatcher': path.join(__dirname, 'src', 'executable', 'AltWhatcher', 'altWatcher.js'),
        'background': path.join(__dirname, 'src', 'background.js')
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
        path: path.resolve(__dirname, 'dist'),
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
                    from: path.resolve(__dirname, 'src', 'public', 'index.html'),
                    to: path.resolve(__dirname, 'dist', 'index.html')
                },
                {
                    from: path.resolve(__dirname, 'src', 'manifest.json'),
                    to: path.resolve(__dirname, 'dist', 'manifest.json')
                },
                {
                    from: path.resolve(__dirname, 'src', 'libs'),
                    to: path.resolve(__dirname, 'dist', 'js')
                }
            ]
        })
    ],
    resolve: {
        modules: [
            path.join(__dirname, 'src', 'executable'),
            path.join(__dirname, 'src', 'options'),
            path.join(__dirname, 'node_modules'),
        ],
        alias: {
            'vue': 'vue/dist/vue.esm-bundler.js'
        }
    }
}