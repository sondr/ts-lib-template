import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import * as path from 'path';
import * as webpack from 'webpack';


let pkg = require('./package.json');
let year = new Date().getFullYear();

let copyright = `${pkg.name}.ts v${pkg.version}
Copyright (c) 2018-${year} ${pkg.author}
@license ${pkg.license}`;

const srcDir = path.resolve(__dirname, 'src');
const distDir = path.resolve(__dirname, 'dist');
const demoDir = path.resolve(__dirname, 'demo');

function configure(env: any, args: any): webpack.Configuration {
  let styleLoaders: webpack.Loader[] = [
    'css-loader?sourceMap&importLoaders=1',
    'postcss-loader?sourceMap',
    'sass-loader?sourceMap'
  ];

  let config: webpack.Configuration = {
    entry: { 
      gallery: path.resolve(srcDir, 'index.ts'),
      demo: path.resolve(demoDir, 'index.js')
  },
    output: {
      path: distDir,
      library: '[name]',
      libraryTarget: 'umd',
      umdNamedDefine: true,
      filename: '[name].js'
      //filename: './[name].js'
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js']
    },
    module: {
      rules: [
        { test: /.tsx?$/, loader: 'ts-loader' },
        {
          test: /\.scss$/,
          use: (args.mode === 'production') ? ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: styleLoaders
          }) : ['style-loader', ...styleLoaders]
        },
        {
          test: /\.(png|jpg|jpeg|gif|ico)$/,
          use: 'file-loader?name=assets/[name]-[hash].[ext]'
        }
      ]
    },
    plugins: [
      new webpack.BannerPlugin(copyright),
      new HtmlWebpackPlugin({
          inject: 'head',
          hash: true,
          template: 'demo/index.ejs',
          // favicon: 'assets/favicon.ico'
      })
    ]
  };

  switch (args.mode) {
    case 'development':
        config.devtool = 'inline-source-map';
        break;

    case 'production':
        config.plugins!.push(new ExtractTextPlugin('[name].css'));
        break;
}

  return config;
}

export default configure;