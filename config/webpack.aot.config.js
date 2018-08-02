var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var ngToolsWebpack = require('@ngtools/webpack');
var path = require('path');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var HtmlWebpackPlugin = require('html-webpack-plugin');

var root = path.resolve(__dirname, '../');

var node = root+'/node_modules';

var webpackConfig = {

    entry: {
        'main': path.join(root,'src/main.prod.ts')
    },
    output: {
        path: path.join(root, 'dist'),
        filename: 'js/[name].[hash].bundle.js',
        chunkFilename: 'js/[id].[hash].chunk.js'
    },
    module: {
        loaders: [
            { test: /\.ts$/, loader: '@ngtools/webpack'},
            { test: /\.html$/, loader: 'raw-loader' },
            {
                test: /\.css$/,
                loaders: ['style-loader', 'css-loader'],
                include: root+'/src/app'
            },
            {
                test: /\.css$/,
                exclude: root+'/src/app',
                loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader' })
            },
            {
                test: /\.(png|jpg|woff|woff2|eot|ttf|svg)$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    name: 'static/[name].[hash:8].[ext]'
                }
            },
            {include: /\.json$/, loaders: ["json-loader"]}
        ]
    },
    resolve: {
        extensions: [ '.js', '.ts', '.html', '.css' ],
        alias: {
            'chart.js': node+'/chart.js/dist/Chart.min.js',
            'moment': node+'/moment/min/moment.min.js',
            'moment-timezone': node+'/moment-timezone/builds/moment-timezone-with-data-2012-2022.min'
        }
    },
    plugins: [
        // see https://github.com/angular/angular/issues/11580
        // new webpack.ContextReplacementPlugin(
        //   /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
        //   './src'
        // ),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(true),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        }),
        new ExtractTextPlugin({filename:"styles.[hash].css", allChunks: false}),
        // new BundleAnalyzerPlugin(),
        new HtmlWebpackPlugin({
            template: __dirname+'/prod.html',
        })
    ]

};

webpackConfig.plugins.push(new ngToolsWebpack.AotPlugin({
    tsConfigPath: path.join(root,'tsconfig.json'),
    entryModule: path.join(root, 'src/app/app.module#AppModule')
}));

module.exports = webpackConfig;
