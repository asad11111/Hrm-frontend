var webpack = require('webpack');
var path = require('path');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var HtmlWebpackPlugin = require('html-webpack-plugin');
var root = path.resolve(__dirname, '../');
var webpackConfig = {
    performance: { hints: false },
    entry: { 'main': path.join(root, '/src/main.browser.ts') },
    output: { path: path.join(root, '/web') },
    plugins: [
        new webpack.DllReferencePlugin({
            context: '.',
            manifest: require('../web/vendor-manifest.json')
        }),
        new webpack.optimize.OccurrenceOrderPlugin(true),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        }),
        new HtmlWebpackPlugin({
            template: __dirname + '/index.html'
        })
    ],
    module: {
        loaders: [
            {
                test: /\.ts$/, loaders: [
                    'awesome-typescript-loader',
                    'angular2-template-loader',
                    'angular-router-loader']
            },
            // {test: /\.svg$/, loader: 'svg-inline-loader'},
            { test: /\.css$/, loaders: ['style-loader', 'css-loader'] },
            { test: /\.(png|woff|woff2|svg|eot|ttf)$/, loader: 'url-loader?limit=10000' },
            { test: /\.html$/, loader: 'raw-loader' },
            { include: /\.json$/, loaders: ["json-loader"] }
        ]
    }

};

var defaultConfig = {
    cache: true,
    output: {
        filename: '[name].bundle.js',
        chunkFilename: '[id].chunk.js'
    },
    resolve: {
        // root: [ path.join(__dirname, 'src') ],
        extensions: ['.ts', '.js'],
        alias: {
            'chart.js': path.join(root, '/node_modules/chart.js/dist/Chart.min.js')
        }
    },

    devServer: {
        watchOptions: { aggregateTimeout: 300, poll: 1000 },
        proxy: {
            "/core/**": {
                target: 'http://gleehrm.local ', //http://gleehrm.local , http://st.peoplesonic.com , https://app.peoplesonic.com
                changeOrigin: true
            }, 
            '/attendance/**': {
                target: 'http://gleehrm.local ',
                changeOrigin: true
            },
            '/billing/**': {
                target: 'http://gleehrm.local',
                changeOrigin: true
            },
            '/review/**': {
                target: 'http://gleehrm.local',
                changeOrigin: true
            },
            '/affiliates/**': {
                target: 'http://gleehrm.local',
                changeOrigin: true
            },
            '/payroll/**': {
                target: 'http://gleehrm.local',
                changeOrigin: true
            },
            '/nz-payroll/**': {
                target: 'http://gleehrm.local',
                changeOrigin: true
            }
        }
    }
};

var webpackMerge = require('webpack-merge');
module.exports = webpackMerge(defaultConfig, webpackConfig);

