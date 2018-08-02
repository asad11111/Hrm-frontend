var path = require("path");
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

var root = path.resolve(__dirname, '../');

var vendor = path.join(root, 'src', 'vendor.browser.ts');
var out = path.join(root, '/web');

module.exports = {
    entry: {
        vendor: [vendor]
    },
    output: {
        path: out,
        filename: "[name].js",
        library: "[name]"
    },
    resolve: {
        extensions: ['.js']
    },
    module: {
        // noParse: [],
        loaders: [
            // { test: /\.css$/, loaders: ['style-loader', 'css-loader'] },
            { test: /\.css$/, loader: ExtractTextPlugin.extract({
                use: "css-loader"
            })},
            { test: /\.(png|jpg|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=10000' },
            { test: /\.html$/, loader: 'raw-loader' },
            {include: /\.json$/, loaders: ["json-loader"]}
        ]
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.join(out, "[name]-manifest.json"),
            name: "[name]",
        }),
        new ExtractTextPlugin("styles.css"),
        new webpack.optimize.OccurrenceOrderPlugin(true),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        }),
        // new BundleAnalyzerPlugin()
    ]
};