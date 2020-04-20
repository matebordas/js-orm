const path = require('path');

module.exports = {
    entry: './src/index.js', //location of your main js file
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js'  // where js files would be bundled to
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/plugin-proposal-object-rest-spread']
                    }
                }
            }
        ]
    }
}