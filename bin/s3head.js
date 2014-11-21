#!/usr/bin/env node

var AWS = require('aws-sdk');
var url = require('url');
var _ = require('lodash');

function usage(code) {
  console.log('s3head <s3 uri>\n');
  console.log('For example:');
  console.log('  s3head s3://my-bucket/path/to/some/file.txt');
  process.exit(code);
}

if (!process.argv[2]) usage(1);
if (process.argv[2] === '--help' || process.argv[2] === '-h') usage(0);

var uri = url.parse(process.argv[2]);
var s3 = new AWS.S3();

s3.config.getCredentials(function(err) {
  if (err && err.message !== 'Could not load credentials from any providers') throw err;
  request = err ?
    _.partial(s3.makeUnauthenticatedRequest.bind(s3), 'headObject') :
    s3.headObject.bind(s3);

  request({
    Bucket: uri.hostname,
    Key: uri.pathname.slice(1)
  }, function(err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    for (var k in data) {
      if (k === 'Metadata') continue;
      console.log('%s: %s', k, data[k]);
    }
  });
});
