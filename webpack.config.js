var webpack = require('webpack');
var path = require('path');

//loader不需要require

module.exports = {
    entry: {
        chat: './public/js/chat.js',
    },
    output: {
        path: path.resolve(__dirname + '/public/build'),
        filename: "[name].bundle.js",
    },
    module: {
        loaders: [{
            test: /\.css$/,
            loader: 'style-loader!css-loader',
            exclude: path.resolve(__dirname + 'node_modules'),

        }, {
            test: /\.(png|jpg)$/,
            loader: 'url-loader?limit=8192',
            include: path.resolve(__dirname, "public")
        }]
    }
};