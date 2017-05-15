var path = require("path");

module.exports = {
  entry: "./demo/main.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "demo"),
  },
  devServer: {
    contentBase: path.join(__dirname, "demo"),
  },
};
