var webpack = require('webpack');
var path = require('path');
var vendors = [
"jquery",
"bootstrap"
];

module.exports = {
    output:{
        path: path.resolve('./build/lib'),
        filename:'[name].js',
        library:'[name]',
    },
    entry:{
        "libs":vendors,
    },
    plugins:[
        new webpack.DllPlugin({
            path:'./manifest.json',
            name:'[name]',
            context:__dirname
        })
    ]
}