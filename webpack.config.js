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
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      { test: /\.tsx?$/, loader: "ts-loader" },
    ],
  },
};
