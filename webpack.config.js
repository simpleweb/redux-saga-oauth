var path = require("path");

module.exports = {
  entry: ["babel-polyfill", "./demo/main.js"],
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "demo"),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env'],
          },
        },
      },
    ],
  },
  devServer: {
    contentBase: path.join(__dirname, "demo"),
  },
};
