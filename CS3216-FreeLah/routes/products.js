var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Product = require('../models/product');

router.get('/', function(req, res) {
  Product.getAllProducts(
    function(products) {
      products.sort(function(a, b) {
        if (a.status=='bidding' && b.status!='bidding') {
          return 1;
        } else if (a.status!='bidding' && b.status=='bidding') {
          return -1;
        } else {
          return a.createdAt - b.createdAt;
        }
      });
      console.log(products);
      res.json(products);
    },function(error) {
      res.status(400).json(error);
    }
  );
});

router.get('/:id', function(req, res) {
  Product.getProductById(req.params.id, 
    function(product) {
      res.json(product);
    },
    function(error) {
      res.status(400).json(error);
    }
  );
});

module.exports = router;
