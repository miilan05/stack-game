const path = require("path");

module.exports = {
    entry: { 
        "index.html": "./src/index.html",
    },
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
          { test: /\.css$/, use: ['style-loader', 'css-loader'] },
          {
            test: /\.(png|jpg|gif)$/i,
            use: [
              {
                loader: 'file-loader',
                options: {
                  name: '[name].[ext]',
                  outputPath: './Images',
                  publicPath: './Images',
                },
              },
            ],
          },        
        ]
      },
    mode: "development"
}