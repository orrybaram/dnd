var webpack = require('webpack');
var path = require("path");
var ngAnnotatePlugin = require('ng-annotate-loader');
require('ngtemplate-loader');

module.exports = function(options) {

    /*
        ENTRIES

        These define separate bundles that are then used on each corresponding page
        This lets us separate bigger apps (eg. client dashboard or admin request page) from
        the rest of the code base. 
    */

    var entry = {
        "main": "./src/js/index.js",
        "data": "./src/data/index.js"
    };


    /* 
        PLUGINS

        https://webpack.github.io/docs/list-of-plugins.html

        ngAnnotate Plugin -- used in conjunction with `@ngInject` 
        to make sure angular modules work when minified

        CommonsChunkPlugin -- creates bundles that contain common code found all over the site

        LimitChunkPlugin -- Limit the chunk count to a defined value. Chunks are merged until it fits.
    */

    var plugins = [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common',
            filename: 'common' + (options.production ? ".min" : "") + '.js',
            minChunks: 2
        }),
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 5
        })
    ];

    /* 
        PRODUCTION PLUGINS

        https://webpack.github.io/docs/list-of-plugins.html

        UglifyJsPlugin - minifies all js
        DedupePlugin - Search for equal or similar files and deduplicate them in the output.
        NoErrorsPlugin - When there are errors while compiling this plugin skips the emitting phase
    */
    if (options.production) {
        plugins.push(
            // new ngAnnotatePlugin({
            //     add: true,
            // }),
            new webpack.optimize.UglifyJsPlugin(),
            new webpack.optimize.DedupePlugin(),
            new webpack.NoErrorsPlugin()
        );
    }

    /* 
        LOADERS

        https://webpack.github.io/docs/loaders

        Babel -- converts all js files from es6 syntax to es5
        ngTemplate -- Lets you cache angular templates
    */
    var loaders = [
        {
            loader:'ng-annotate?map=false',
            test: /\.js$/,
            exclude: [
                path.resolve(__dirname, "node_modules"),
            ],
        },
        {
            loader:'babel-loader',
            test: /\.js$/,
            exclude: [
                path.resolve(__dirname, "node_modules"),
            ],
            query: {
                presets: ['es2015']
            }
        }, 
    ];

    // This is where the bundles will be output
    var output = {
        path: "./dist",
        filename: "[name]-bundle" + (options.production ? ".min" : "") + ".js",
        pathinfo: options.debug
    };

    
    return {
        entry: entry,
        output: output,
        plugins: plugins,
        module: {
            loaders: loaders,
            extensions: ['.js', '']
        },
        resolve: {
            alias: {
                "components": path.resolve(__dirname, './src/components'),
                "data": path.resolve(__dirname, './src/data')
            }
        }
    };
};