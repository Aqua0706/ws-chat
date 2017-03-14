var webpack = require('webpack');
var path = require('path');
module.exports = {
    entry: {
        chat: './public/js/chat.js'
    },
    output: {
        path: path.resolve(__dirname + '/build/js'),
        filename: "chat.js"
    },
    module: {
        loaders: [{
            test: /\.css$/,
            loader: 'style-loader!css-loader'
        },{
            test:/.(png|jpg)$/
            loader:''//还没npm
        }]
    },
    plugins: [
        new webpack.DllReferencePlugin({
            context: path.resolve(__dirname),
            manifest: require('./manifest.json'),
        })
    ]
};