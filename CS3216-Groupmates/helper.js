var Sequelize = require('sequelize');
var YAML = require('yamljs');

var config = YAML.load('config.yml');

function startServer(app) {
  var server = app.listen(config['server']['port'], function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('App listening at http://%s:%s', host, port);
  });
}

function getRoot() {
  var root = 'http://' + config['server']['host'];
  var port = config['server']['public_port'];
  if (port !== '') {
    root += ':' + port;
  }
  return root;
}

exports.startServer = startServer;

exports.getRoot = getRoot;

// TODO Proposal: make database connection persistent
exports.getDb = function() {
  return new Sequelize(
    config['db']['db_name'],
    config['db']['username'],
    config['db']['password'], {
      host: config['db']['host'],
      dialect: 'mysql'
  });
}

exports.getIvleApiUrl = function(endPoint, authToken) {
  return 'https://ivle.nus.edu.sg/api/Lapi.svc/' +
    endPoint + '?APIKey=' + config['ivle']['lapi_key'] +
    '&AuthToken=' + authToken;
};

// createFacebookPassport
// a process to create passport and set up for Facebook authentication
var dbUtilUser = require('./db_util/user');
function createFacebookPassport() {
  // NOTE taken from routes/index
  var passport = require('passport');
  var FacebookStrategy = require('passport-facebook').Strategy;
  // use config from config.yml

  // routines to restore user setting
  passport.serializeUser(function(user, done) {
    done(null, user); // no-op
  });
  passport.deserializeUser(function(obj, done) {
    // TODO add details to `user`
    done(null, obj);  // no-op
  });
  // Facebook Strategy
  passport.use(new FacebookStrategy({
      clientID: config['facebook']['app_id'],
      clientSecret: config['facebook']['app_secret'],
      callbackURL: getRoot() + '/account/login/callback'
    },
    function(accessToken, refreshToken, profile, done) {
      process.nextTick(function() {
        // query the database for the profile
        // if the profile is not in the database, a new profile is created
        dbUtilUser.createUserProfile(accessToken, profile, done);
      });
    }
  ));
  return passport;
}
var singletonFacebookPassport = createFacebookPassport();
exports.getFacebookPassport = function () {
  return singletonFacebookPassport;
};

exports.isLoggedIn = function(profile) {
  return !!profile; // TODO: additional checks maybe?
};

exports.getIvleModulesUrl = function(authToken) {
  return 'https://ivle.nus.edu.sg/api/Lapi.svc/Modules' +
    '?APIKey=' + config['ivle']['lapi_key'] +
    '&AuthToken=' + authToken +
    '&Duration=0&IncludeAllInfo=false&output=json';
};

exports.getIvleClassRoasterUrl = function(authToken, courseId) {
  return 'https://ivle.nus.edu.sg/API/Lapi.svc/Class_Roster' +
    '?APIKey=' + config['ivle']['lapi_key'] +
    '&AuthToken=' + authToken +
    '&CourseID=' + courseId
};