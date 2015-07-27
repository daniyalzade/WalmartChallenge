var express = require('express');
var router = express.Router();
var async = require('async');
var fs = require('fs');
var http = require('http');
var Entities = require('html-entities').XmlEntities;

var query = undefined;
var result = [];

function findProducts(filename, callback) {
  fs.readFile(filename, callback);
}

function callback(err, fileContent) {
  if (err)
    throw err;
  var array = fileContent.toString().split(",\n");

  async.eachSeries(array, function(product, callback2) {
    var requestUrl = 'http://api.walmartlabs.com/v1/items/' +
        + product + '?format=json&apiKey=kjybrqfdgp3u4yv2qzcnjndj';
    setTimeout(checkWalmart(requestUrl), 100);
    callback2();
  }, function(err){
    if( err ) {
      throw err;
    } else {
      console.log('All products have been processed successfully');
    }
  });
}

function callback2() {
  console.log('done');
}

function checkWalmart(requestUrl) {
  http.get(requestUrl, function (response) {
    if (response.statusCode == 200) {
      var buffer = '';
      response.on('data', function(data) {
        buffer += data;
      });
      response.on('end', function(data) {
        var obj = JSON.parse(buffer);
        if (obj.shortDescription != undefined) {
          var entities = new Entities();
          if (entities.decode(obj.shortDescription.toLowerCase()).indexOf(query) >= 0 ||
            entities.decode(obj.longDescription.toLowerCase()).indexOf(query) >= 0) {
            result.push(obj.itemId);
          }
        }
      });
    }
  }).on('error', console.error);;
}

/* GET home page. */
router.get('/:query', function(req, res, next) {
  query = req.params.query;
  findProducts('items.csv', callback);
  res.status(200).send(result);
});

module.exports = router;
