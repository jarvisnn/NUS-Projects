var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Product = require('../models/product');
var Activity = require('../models/activity');

/* GET users listing. */

router.post('/', function(req, res) {
  User.createUser(req.body,
    function(user) {
      Activity.create('Welcome to FreeLah', 
          'Thank you for using FreeLah, let\'s share your items and help each others :)', 
          user.id, -1);
      res.json(user);
    },
    function(error) {
      res.status(400).json(error);
    }
  );
});

router.get('/', function(req, res) {
  User.getAllUser(
    function(users) {
      res.json(users);
    },
    function(error) {
      res.status(400).json(error);
    }
  );
});

router.get('/:id', function(req, res) {
  var token = req.headers.authorization;
  User.getUserById(req.params.id, 
    function(user) {
      if (user.basicAuth == token) {
        res.json(user);
      } else {
        res.json({
          id: user.id,
          username: user.username,
          fullName: user.fullName
        });
      }
    },
    function(error) {
      res.status(400).json(error);
    }
  );
});

router.put('/:id', function(req, res) {
  var token = req.headers.authorization;
  User.getUserById(req.params.id, 
    function(user) {
      if (user == null) {
        res.status(400).json({message: 'User not found!'});
      } else if (user.basicAuth != token) {
        res.status(401).json({message: 'Bad authorization!'});
      } else {
        User.updateUser(req.params.id, req.body, 
          function(user) {
            res.json(user);
          },
          function(error) {
            res.status(400).json(error);
          }
        );
      }
    },
    function(error) {
      res.status(400).json(error);
    })
});

router.post('/:id/products', function(req, res) {
  console.log('start posting');
  var token = req.headers.authorization;

  User.getUserById(req.params.id, 
    function(user) {
      if (user == null) {
        res.status(400).json({message: 'User not found!'});
      } else if (user.basicAuth != token) {
        res.status(401).json({message: 'Bad authorization!'});
      } else if (req.body.expiryDate != null && req.body.expiryDate > 1000) {
        res.status(400).json({message: 'Time period should be smaller than 1000 hours.'});
      } else {
        Product.createProduct(req.params.id, req.body, 
          function(product) {
            if (product.expiryDate != 0) {
              setTimer(product);
            }
            Activity.create('New product: ['+product.name+']', "You have just created a new product.", user.id, product.id);
            res.json(product);
          },
          function(error) {
            res.status(400).json(error);
          }
        );        
      }
    }, 
    function(error) {
      res.status(400).json(error);
    }
  );
});

router.put('/:id/products/:productId', function(req, res) {
  var token = req.headers.authorization;
  User.getUserById(req.params.id, 
    function(user) {
      if (user == null) {
        res.status(400).json({message: 'User not found!'});
      } else if (user.basicAuth != token) {
        res.status(401).json({message: 'Bad authorization!'});
      } else {
        Product.updateProduct(req.params.productId, req.body, 
          function(product) {
            res.json(product);
          },
          function(error) {
            res.status(400).json(error);
          }
        );    
      }
    }, 
    function(error) {
      res.status(400).json(error);
    }
  );
});

router.get('/:id/products/:productId', function(req, res) {
  Product.getProductById(req.params.productId, 
    function(product) {
      res.json(product);
    },
    function(error) {
      res.status(400).json(error);
    }
  );
});

router.get('/:id/activities', function(req, res) {
  var token = req.headers.authorization;
  User.getUserById(req.params.id,
    function(user) {
      if (user == null) {
        res.status(400).json({message: 'User not found!'});
      } else if (user.basicAuth != token) {
        res.status(401).json({message: 'Bad authorization!'});
      } else {
        Activity.getAllActivitiesFromUser(req.params.id, 
          function(activities) {
            res.json(activities);
          },
          function(error) {
            res.status(400).json(error);
          }
        );    
      }
    }, 
    function(error) {
      res.status(400).json(error);
    }
  );
});

function setTimer(originproduct) {
  if (originproduct.expiryDate == 0) {
    return;
  }
  setTimeout(function() {
    console.log('Timeout start here:');
    Product.getProductById(originproduct.id, function(product) {
      product.status = product.highestBid == 0 ? 'expired' : 'given';
      product.save().then( function() {
        console.log(product.status);  
        if (product.status == 'given') {
          User.getUserById(product.userId, 
            function(user) {
              Activity.create('Congrats! You won the product ['+product.name+']!', 
                'Please contact ' + user.username + ' with phone number: ' + user.phoneNumber + ' and email: ' + user.email + ' for collecting.', 
                product.buyerId, product.id);
              User.getUserById(product.buyerId, 
                function(buyer) {
                  user.point += product.highestBid;
                  user.save();
                  Activity.create('Your ['+product.name+'] has been given!', 
                    'You got '+product.highestBid+' credits. '+ buyer.username + ' with contact you soon with phone number: ' + buyer.phoneNumber + ' and email: ' + buyer.email + '.', 
                    product.userId, product.id);
                },
                function(error) {
                  console.log(error);
                });
            },
            function(error) {
              console.log(error);
            }
          );
        }
      });
    }, function(err) {
      console.log(err);
    });
  }, originproduct.expiryDate * 3600000);
}

module.exports = router;
