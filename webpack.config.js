const nodeExternals = require("webpack-node-externals");
module.exports = {
  externals: [nodeExternals()],
  mode: "production",
  target: "node",
  entry: "./src/shadowpool.ts",
  output: {
    filename: "shadow.js",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: "ts-loader" },
    ],
  },
};
