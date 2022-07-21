var path = require('path');
var webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const DojoWebpackPlugin = require('dojo-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/main.js',
    devtool: false, //'source-map',
    devServer: {
        historyApiFallback: true,
    },
    output: {
        filename: 'UNFIPricer.js',
        path: path.resolve(__dirname, 'webroot/'),
        chunkFilename: "chunk-[name].[contenthash].js"
        //,
        //  publicPath: '/webroot/'
    },
    resolve: {
        extensions: ['.js']
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: '/node_modules',
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/env"]
                    }
                }
            }
        ]
    },
    plugins: [
        new HTMLWebpackPlugin({
            showErrors: true,
            cache: true,
            title: 'UNFIPricer',
            favicon: null,
            template: path.resolve(__dirname, 'src/index.html')
        }),
        new DojoWebpackPlugin({
            loaderConfig: require("./loaderConfig"),
            locales: ["en", "es", "fr"],
            async: true
        }),
        new webpack.NormalModuleReplacementPlugin(
            /^dojo\/domReady!/, (data) => {
                const match = /^dojo\/domReady!(.*)$/.exec(data.request);
                data.request = "dojo/loaderProxy?loader=dojo/domReady!" + match[1];
            }
        ),
        new CopyWebpackPlugin({
            patterns: [
                {from: '../../../../src/balek-modules/coopilot/UNFIPricer/resources/images/' ,
                to: 'balek-modules/coopilot/UNFIPricer/resources/images/' }
            ]
        })
    ]
};
