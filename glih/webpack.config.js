var webpack = require('webpack');

module.exports = {
  entry: './app/index',

  module: {
    loaders: [
      {
        include: /app/,
        loader: 'babel',
        test: /\.js$/
      },
      {
        include: /app/,
        loaders: ['style', 'css', 'sass'],
        test: /\.scss$/
      }
    ]
  },

  output: {
    filename: 'application.js',
    path: './public'
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    })
  ],

  resolve: {
    extensions: ['', '.js'],
    modulesDirectories: ['app', 'node_modules'],
    root: __dirname
  },

  sassLoader: {
    includePaths: ['app']
  }
};
