const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === "development";

  return {
    mode: argv.mode,
    entry: "./src/app.js",
    output: {
      path: path.resolve(__dirname, "build"),
      filename: "bundle.js",
    },
    module: {
      rules: [
        {
          test: /\.html$/,
          use: ["html-loader"],
        },
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, "css-loader"],
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg)$/i,
          type: "asset/resource",
          generator: {
            filename: "images/[name][ext]",
          },
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/app.html",
      }),
      new MiniCssExtractPlugin({
        filename: isDevelopment
          ? "styles/styles.css"
          : "../build/styles/styles.css",
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: "images",
            to: "images",
          },
        ],
      }),
    ],
    devServer: {
      static: {
        directory: path.resolve(__dirname, "build"),
      },
      port: 3002,
    },
    optimization: {
      minimize: !isDevelopment,
    },
  };
};
