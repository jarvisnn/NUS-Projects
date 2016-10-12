module.exports = {
  entry: {
    app: getEntrySources(['./src/js/app.js'])
  },
  output: {
    path: './public/js',
    publicPath: '/js',
    filename: 'all.js'
  },
  module: {
    loaders:[
      {
        test: /\.js$/,
        loaders: getLoaders(['jsx', 'babel']),
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loader: 'style!css!sass'
      }
    ]
  }
};

function getEntrySources(sources) {
  // if (process.env.NODE_ENV === 'dev') {
  //   sources.push('webpack-dev-server/client?http://localhost:8080');
  //   sources.push('webpack/hot/only-dev-server');
  //   sources.push('./src/js/dev.js');
  // }

  // if (process.env.NODE_ENV === 'production'){
  //   sources.unshift('./src/js/ga.js');
  // }

  return sources;
}

function getLoaders(loaders){
  // if (process.env.NODE_ENV === 'dev') {
  //   loaders.unshift('react-hot');
  // }

  return loaders;
}