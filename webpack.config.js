const path = require('path');

const ExtractTextPlugin = require('extract-text-webpack-plugin')

const webpack = require('webpack');

const extractSass = new ExtractTextPlugin({
  filename: 'gumzo.css'
})

function sassRules() {
  return [{
    test: /\.(sass|scss)$/,
    loader: extractSass.extract(['css-loader', 'sass-loader'])
  }]
}

function scriptRules() {
  return [{
    test: /\.js$/,
    exclude: [/node_modules/],
    loader: 'babel-loader',
    options: {
      presets: ['env', 'es2015', 'stage-2'],
      plugins: ["transform-class-properties"]
    }
  }]
}

function cssRules() {
  return [{
      test: /\.(sass|scss|css)$/,
      loader: extractSass.extract(['css-loader', 'sass-loader'])
    }, {
      test: /\.(woff|svg|woff2|ttf|eot)$/,
      exclude: [
        /node_modules/,
        path.resolve(__dirname, "resources/assets/sass/icons/flag-icon-css")
      ],
      loader: "file-loader?name=[name].[ext]&outputPath=fonts/&publicPath=fonts/"
    }, {
      test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
      exclude: [
        /node_modules/,
        path.resolve(__dirname, "resources/assets/sass/icons/font-awesome"),
        path.resolve(__dirname, "resources/assets/sass/icons/iconmind"),
        path.resolve(__dirname, "resources/assets/sass/icons/material-design-iconic-font"),
        path.resolve(__dirname, "resources/assets/sass/icons/simple-line-icons"),
        path.resolve(__dirname, "resources/assets/sass/icons/themify-icons"),
        path.resolve(__dirname, "resources/assets/sass/icons/weather-icons")
      ],
      loader: "url-loader?limit=10000&name=[name].[ext]&outputPath=flags/&publicPath=flags/"
    },{
      test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
      exclude: [
        /node_modules/,
        path.resolve(__dirname, "resources/assets/sass/icons/flag-icon-css"),
        path.resolve(__dirname, "resources/assets/sass/icons/font-awesome"),
        path.resolve(__dirname, "resources/assets/sass/icons/iconmind"),
        path.resolve(__dirname, "resources/assets/sass/icons/material-design-iconic-font"),
        path.resolve(__dirname, "resources/assets/sass/icons/simple-line-icons"),
        path.resolve(__dirname, "resources/assets/sass/icons/themify-icons"),
        path.resolve(__dirname, "resources/assets/sass/icons/weather-icons")
      ],
      loader: "url-loader?limit=10000&name=[name].[ext]&outputPath=svg/&publicPath=svg/"
    }, {
    test: /\.(jpe?g|png|gif)$/i,
    use: [{
        loader: 'file-loader?name=[name].[ext]&outputPath=images/&publicPath=images'
      },
      {
        loader: 'image-webpack-loader',
        options: {
          query: {
            mozjpeg: {
              progressive: true,
            },
            gifsicle: {
              interlaced: true,
            },
            optipng: {
              optimizationLevel: 7,
            }
          }
        }
      }
    ]
  }]

}


module.exports = {
    mode: "development",
    entry: {
        accounts:'./resources/assets/scripts/accounts.js',
        vendors: './resources/assets/scripts/vendors.js',
        gumzo: ['./resources/assets/sass/app.scss', './resources/assets/scripts/app.js']
    },

    output: {
        path: path.resolve(__dirname, "public"),
        filename: 'js/[name].js',
        publicPath: "http://cdn.gumzo/"
    },
    module: {
        rules: cssRules().concat(scriptRules())
    },
    plugins: [
        extractSass,
        new webpack.ProvidePlugin({
          $: "jquery",
          jQuery: "jquery",
          "window.jQuery": "jquery"
        })
    ]
}
