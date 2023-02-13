const path = require("path");

module.exports = {
    entry:  './src/script.js',
    devServer: {
        port: 8080,
        static: './dist',
        hot: true
      },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
          {
            test: /\.css$/,
            use: [
              'style-loader',
              'css-loader'
            ]
          }
        ]
      },
    mode: "development"
}