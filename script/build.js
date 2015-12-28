#!/usr/bin/env node

/* ================================================================
 * unlock-apk by xdf(xudafeng[at]126.com)
 *
 * first created at : Wed Aug 26 2015 11:55:14 GMT+0800 (CST)
 *
 * ================================================================
 * Copyright  xdf
 *
 * Licensed under the MIT License
 * You may not use this file except in compliance with the License.
 *
 * ================================================================ */

'use strict';

var fs = require('fs');
var path = require('path');
var _ = require('../lib/helper');
var spawn = require('win-spawn');
//var Build = require('java-build');
var JAVA_HOME = require('java-home');
var ant = require('ant-lite').binPath;

var isWindows = _.platform.isWindows;
var cwd = path.join(__dirname, '..');

function selectAndroidSdkSync() {
  var env = global.process.env;

  if (!env.ANDROID_HOME) {
    //throw 'ANDROID_HOME is not set';
    console.log('ANDROID_HOME is not set');
    return null;
  }

  var platforms = path.join(env.ANDROID_HOME, 'platforms');

  if (!_.isExistedDir(platforms)) {
    console.log('platforms directory is not exist');
    return null;
  }

  var res = fs.readdirSync(platforms);

  res = _.filter(res, function(n) {
    return !!~n.indexOf('android');
  });

  if (!res.length) {
    console.log('platforms directory is not exist');
    return null;
  }

  return res;
}

JAVA_HOME.getPath(function(error, javaHome) {
  if (error) {
    //throw 'JAVA_HOME is not set';
    console.log('JAVA_HOME is not set');
    return;
  }
  console.log('JAVA_HOME is set to ' + javaHome);

  var sdkVersion = selectAndroidSdkSync();

  var propertyFile = path.join(__dirname, '..', 'project.properties');
  var properties = fs.readFileSync(propertyFile, 'utf8');

  properties = properties.split('target=')[0];
  properties += 'target=' + sdkVersion[sdkVersion.length - 1];

  fs.writeFileSync(propertyFile, properties);

  var process = spawn(ant, ['debug'], {
    cwd: cwd
  });

  process.on('error', function(err) {
    //throw err;
    console.log(err);
  });

  process.stdout.setEncoding('utf8');
  process.stderr.setEncoding('utf8');

  process.stdout.on('data', function(data) {
    console.log(data);
  });
  process.stderr.on('data', function(data) {
    console.log(data);
  });

  process.on('exit', function(code) {
    if (code !== 0) {
      //throw 'build failed';
      console.log('build failed');
    }
  });

});
