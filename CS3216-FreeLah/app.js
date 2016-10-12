var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var YAML = require('yamljs');
var c = require('appcache-node');

var routes = require('./routes/index');
var users = require('./routes/users');
var auth = require('./routes/auth');
var products = require('./routes/products');
var bid = require('./routes/bid');

var config = YAML.load('config.yml');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.disable('etag');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

// Cache
var Product = require('./models/product');
app.get('/*app.cache', function(req, res) {
  res.setHeader('content-type','text/cache-manifest');
  var cache = "CACHE MANIFEST\n\# "+ new Date() + "\n";
  cache += 
    "CACHE:\n\
    /js/all.js\n\
    /css/app.min.css\n\
    /img/banner-bg.jpg\n\
    /img/credit.jpg\n\
    /img/funny-item.jpg\n\
    /img/garage-sale.jpg\n\
    /img/intro-bg-2.jpg\n\
    /img/intro-bg.jpg\n\
    /about\n\
    /signup\n\
    /login\n\
    /logout\n\
    /activity\n\
    /billy.ttf\n\
    https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css\n\
    https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js\n";

  Product.getAllProducts(function (products) {
    console.log(typeof products);
    for (var i = 0; i < products.length; i++) {
      cache += '    /' + products[i].imgUrls.replace(' ', '') + '\n';
      cache += '    /products/' + products[i].id + '\n';
    }

    cache += '\nNETWORK:\n*\n\nFALLBACK:';
    res.send(cache);
  }, function(err) {
    console.log(err);
    res.send(err);
  });
})

// Routes
app.use('/api/auth', auth)
app.use('/api/users', users);
app.use('/api/products', products);
app.use('/api/bid', bid);

app.get('*', function(req, res) {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
})


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;

var server = app.listen(config['server']['port'], function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('App listening at http://%s:%s', host, port);
});
