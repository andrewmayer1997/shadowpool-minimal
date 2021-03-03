const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const css = require("css-loader");
const style = require("style-loader");

module.exports = {
  resolve: {
    extensions: [".ts", ".js", ".css"],
  },
  mode: "development",
  entry: {
    app: ["./app.ts"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Remote logger",
    }),
    new CleanWebpackPlugin(),
  ],
  module: {
    rules: [
      // compile ts
      {
        test: /\.tsx?$/,
        include: [path.resolve(__dirname, "../src")],
        exclude: [path.resolve(__dirname, "../node_modules")],
        loader: "ts-loader",
      },
      {
        test: /\.css$/i,
        use: [
          {
            loader: "style-loader",
            options: {
              insert: "head",
            },
          },
          "css-loader",
        ],
      },
    ],
  },
  output: {
    filename: "[contenthash].js",
    chunkFilename: "[contenthash].js",
    path: path.resolve(__dirname, "../../../../dist/view"),
  },
  optimization: {
    runtimeChunk: "single",
    splitChunks: {
      chunks: "all",
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            // get the name. E.g. node_modules/packageName/not/this/part.js
            // or node_modules/packageName
            const packageName = module.context.match(
              /[\\/]node_modules[\\/](.*?)([\\/]|$)/
            )[1];

            // npm package names are URL-safe, but some servers don't like @ symbols
            return `module.${packageName.replace("@", "")}`;
          },
        },
      },
    },
  },
};
