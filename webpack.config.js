const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = (env, argv) => {
  const config = {
    entry: './src/index.js',
    output: {
      path: __dirname + '/build',
      publicPath: '',
      filename: 'bundle.js'
    },
    devServer: {
      contentBase: './build'
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: ['babel-loader']
        },
        {
          test: /\.(sass|scss)$/,
          use: [
            argv.mode === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
            { loader: "css-loader", options: { minimize: argv.mode === 'production' } },
            "postcss-loader",
            'sass-loader'
          ]
        },
         {
             test: /\.(woff(2)?|ttf|eot|svg|png|jpg|gif)$/,
             use: [
               {
                 loader: 'file-loader',
                 options: {
                     name: '[path][name].[ext]',
                     context: 'src/'
                 }
               }
             ]
           }
      ]
    },
    resolve: {
      extensions: ['*', '.js', '.jsx']
    },
    plugins: [
      new CleanWebpackPlugin(['build']),
      new HtmlWebpackPlugin({ template: './src/index.html' }),
      new MiniCssExtractPlugin(),
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /uk/),
    ],
  };

  if (argv.mode !== 'production') {
    config.devtool = 'source-map';
    config.plugins.unshift(new webpack.HotModuleReplacementPlugin());
    config.devServer.hot = true;
  }

  return config;
};