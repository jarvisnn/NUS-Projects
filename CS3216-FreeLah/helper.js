var Sequelize = require('sequelize');
var YAML = require('yamljs');
var crypto = require('crypto');
var gm = require('gm').subClass({imageMagick: true});
var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

var config = YAML.load('config.yml');

exports.getDatabase = function() {
  return new Sequelize (
    config['db']['db_name'],
    config['db']['username'],
    config['db']['password'], {
      host: config['db']['host'],
      dialect: 'mysql'
  });
}

exports.hashPassword = function(password) {
  return crypto
    .createHash("md5")
    .update(password)
    .digest('hex');
}

exports.getBasicAuth = function(username, password) {
  return "Basic " + Base64.encode(username+':'+password);
}

exports.saveImage = function(name, data, callback) {
  // var filePathJpeg = config['server']['image_dir'] + name + ".jpeg";
  var filePath = config['server']['image_dir'] + name + ".png";
  var editedFilePath = config['server']['image_dir'] + name + "-edited.png";

  console.log(1);
  require("fs").writeFile(filePath, data, 'base64', function(err) {
    if (err) {
      console.error('can\'t write fs')
      console.error(err);
    } else {
      console.log('gm');
      gm(filePath).resize(600,600).gravity("Center").extent(["600x600",null, null]).write(filePath, function(err) {
        console.log('gm done');
        if (err) {
          console.error("err=", err);
          callback(name+".png", err);
        } else {
          console.log("morphed");
          callback(name+ ".png", null);
        }
      });
    }
  });
 
  // transform
}

exports.return 
