const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  publicPath: "static/",
  configureWebpack: {
    devServer: {
      writeToDisk: true
    },
    plugins: [new CleanWebpackPlugin()]
  }
};
