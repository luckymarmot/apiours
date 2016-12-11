import webpack from 'webpack'

import Clean from 'clean-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import StringReplacePlugin from 'string-replace-webpack-plugin'

import Immutable from 'immutable'
import path from 'path'
import autoprefixer from 'autoprefixer'

const staticPath = '/static/'

class WebpackConfigBase {
  static node = Immutable.fromJS({
    net: 'empty',
    tls: 'empty',
    dns: 'empty'
  });

  static target = 'web';

  static entry = Immutable.fromJS({
    main: './src/index.js',
    vendor: [
      'babel-polyfill',
      'immutable',
      'es6-error',
      'expose-loader',
      'react-dom'
    ]
  });

  static output = Immutable.fromJS({
      path: path.join(__dirname, '.' + staticPath),
      pathInfo: true,
      publicPath: staticPath,
      chunkFilename: '[name].js'
  });

  static eslint = Immutable.fromJS({
    configFile: './linting/prod.yaml'
  });

  static module = Immutable.fromJS({
    preLoaders: [
      { test: /\.jsx?$/,
        loader: 'eslint-loader',
        exclude: /node_modules|webpack/}
    ],
    loaders: [
      {
        test: /\.(gif|jpg|png|woff|woff2|eot|ttf|svg)$/,
        loader: 'file-loader' },
      {
        test: /\.jsx?$/, loader: 'babel',
        exclude: /node_modules/,
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.(styl)$/,
        loader: ExtractTextPlugin.extract(
          'style-loader',
          'css-loader!postcss-loader!stylus-loader'
        )
      },
      {
        test: /\.(css)$/,
        loader: "style-loader!css-loader"
      }
    ],
    noParse: /\.min\.js/
  });

  static resolve = Immutable.fromJS({
    extentions: ['', '.js', '.jsx', '.styl', '.css'],
    modules_directories: ['./src', 'node_modules']
  });

  static plugins = Immutable.fromJS([
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js', Infinity),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    function() {
      this.plugin('done', function(stats) {
        if (stats.compilation.errors &&
          stats.compilation.errors.length &&
          process.argv.indexOf('--bail') !== -1) {
          for (let i = stats.compilation.errors.length - 1; i >= 0; i--) {
            let error = stats.compilation.errors[i]
            console.error(error.message)
          }
          process.exit(1);
        }
      })
    }
  ]);

  static postcss = [
    autoprefixer()
  ];
}


class WebpackConfigDebug extends WebpackConfigBase {
  static devServer = Immutable.fromJS({
    headers: { 'Access-Control-Allow-Origin': '*' },
    contentBase: './src',
    __webpack_public_path__: 'http://localhost:8888',
    hot: true,
    publicPath: 'http://localhost:8888/build/',
    port: 8888,
    host: 'localhost',
    inline: true,
    quiet: false,
    noInfo: false,
    stats: {
      assets: true,
      colors: true,
      version: false,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false
    },
    historyApiFallback: true
  });

  static __webpack_public_path__ = 'http://localhost:8888';

  static debug = true;
  static devtool = 'source-map';
  static entry = WebpackConfigBase.entry.set(
    'main',
    Immutable.fromJS([
      'webpack/hot/dev-server',
      './src/index.js'
    ])
  );

  static output = Immutable.fromJS({
    path: path.join(__dirname, 'build'),
    publicPath: 'http://localhost:8888/build/',
    filename: '[name].js'
  });

  static eslint = Immutable.fromJS({
    configFile: './linting/dev.yaml'
  });

  static module = WebpackConfigBase.module
    .setIn(
      ['loaders', 1, 'loaders'],
      Immutable.fromJS([
        'react-hot',
        'babel-loader'
      ])
    )
    .setIn(
      ['loaders', 2, 'loader'],
      'style-loader!css-loader!postcss-loader!stylus-loader'
    );

  static plugins = WebpackConfigBase.plugins.concat(Immutable.fromJS([
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        STATIC_PATH: JSON.stringify('http://localhost:8888/build/'),
        DEBUG: JSON.stringify(process.env.DEBUG),
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    })
  ]));
}

class WebpackConfigProduction extends WebpackConfigBase {
  static plugins = WebpackConfigBase.plugins.concat(Immutable.fromJS([
    new webpack.DefinePlugin({
      'process.env': {
        STATIC_PATH: JSON.stringify(staticPath),
        DEBUG: JSON.stringify(process.env.DEBUG),
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new Clean(['./static']),
    new Clean(['./build']),
    new ExtractTextPlugin('styles/app.css', {
      allChunks: true
    }),
    new webpack.optimize.DedupePlugin(),
    new StringReplacePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      mangle: false,
      compress: {
        warnings: false,
        sequences: true,
        dead_code: true,
        conditionals: true,
        booleans: true,
        unused: true,
        if_return: true,
        join_vars: true,
        drop_console: true
      }
    })
  ]));

  static module = WebpackConfigBase.module.set('loaders',
    WebpackConfigBase.module.get('loaders').push(
      Immutable.fromJS({
        test: /\.(js|styl)$/,
        loader: StringReplacePlugin.replace({
          replacements: [
            {
              pattern: /(['"])\/static\//g,
              replacement: (match, p1) => p1 + staticPath
            }
          ]
        })
      })
    )
  );

  static bail = true;
  static debug = true;
  static profile = true;
  static output = WebpackConfigBase.output
    .set('pathInfo', false)
    .set('filename', '[name].js')
    .set('chunkFilename', '[id].js')
    .set('sourceMapFilename', '[name].map.js');
  static devtool = '#source-map';
}

const getStaticKeys = obj => {
  let keys = Immutable.List(Object.keys(obj.constructor))
  const ParentClass = obj.__proto__.__proto__.constructor
  if (new ParentClass() instanceof WebpackConfigBase) {
    keys = keys.concat(getStaticKeys(new ParentClass()))
  }
  return keys
}

const buildConfig = cfg => {
  let config = {}
  getStaticKeys(cfg).forEach(key => {
    let value = cfg.constructor[key]
    if (value instanceof Immutable.Map || value instanceof Immutable.List) {
      config[key] = value.toJS()
    }
    else {
      config[key] = value
    }
  })
  return config
}

let config
if (process.env.NODE_ENV === 'production') {
  config = new WebpackConfigProduction()
} else {
  config = new WebpackConfigDebug()
}

module.exports = buildConfig(config)
