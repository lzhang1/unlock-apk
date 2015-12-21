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

var path = require('path');
var _ = require('../lib/helper');
var spawn = require('win-spawn');
//var Build = require('java-build');
var JAVA_HOME = require('java-home');

var isWindows = _.platform.isWindows;
var cwd = path.join(__dirname, '..');

JAVA_HOME.getPath(function(error, javaHome) {
  if (error) {
    throw 'JAVA_HOME is not set';
  }
  console.log('JAVA_HOME is set to ' + javaHome);

  var env = global.process.env;

  if (!env.ANDROID_HOME) {
    throw 'ANDROID_HOME is not set';
  }

  var cmd = path.join(__dirname, 'ant', 'bin', 'ant');

  if (isWindows) {
    cmd = cmd + '.bat';
  }

  var process = spawn(cmd, ['debug'], {
    cwd: cwd
  });
  process.on('error', function(err) {
    throw err;
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
      throw 'build failed';
    }
  });

});
