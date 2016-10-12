var router = require('express').Router();
var helper = require('../helper');
var passport = helper.getFacebookPassport();

var reviewModel = require('../models/review').getModel();
var userModel = require('../models/user').getModel();
var Sequelize = require('sequelize');

var dbUtilReview = require('../db_util/review');
var dbUtilUser = require('../db_util/user');

router.post('/new', function (req, res, next) {
  if (!helper.isLoggedIn(req.user)) {
    res.redirect('/');
  }

  var review = {
    idReviewer: Number.parseInt(req.user.id),
    stars: req.body.stars,
    description: req.body.description,
    moduleCode: req.body.moduleCode,
    semester: req.body.semester
  }

  if (isNaN(req.body.idReviewee)) {
    dbUtilUser.getOrCreateWithMatric({
      name: req.body.name,
      matricNumber: req.body.idReviewee
    }, function(user) {
      review.idReviewee = user[0].id;
      dbUtilReview.createReview(review, function(review) {
        res.redirect('/user/' + review.idReviewee)
      });
    })
  } else {
    review.idReviewee = Number.parseInt(req.body.idReviewee);
    dbUtilReview.createReview(review, function(review) {
      res.redirect('/user/' + review.idReviewee)
    });
  }
});

router.get('/:id', function(req, res, next) {
  var reviewId = Number.parseInt(req.params.id);
  if (!Number.isFinite(reviewId)) {
    return next();
  }

  reviewModel.findById(reviewId, {
    include: [
      {
        model: userModel,
        as: 'reviewee',
        required: false
      },
      {
        model: userModel,
        as: 'reviewer',
        required: false
      }
    ]
  }).then(function(review) {
    if (review == null) {
      res.redirect('/');
    } else {
      res.render('review', {
        review: review,
        reviewUrl: helper.getRoot() + '/reviews/',
        currentUser: req.user
      });
    }
  });
});

router.get('/get', function (req, res, next) {
  if (!helper.isLoggedIn(req.user)) {
    res.redirect('/');
  }
  if (!req.xhr) {
    res.redirect('/');
    return next();
  }
  var query = {
    id: req.query.id,
    reviewer: req.query.reviewer,
    reviewee: req.query.reviewee,
    limit: req.query.limit,
    offset: req.query.offset
  };
  if (query.reviewer || query.reviewee || query.id)
    dbUtilReview.findReview(query, function(data) {
      res.json(data);
    });
  else
    next();
});

router.post('/delete/:id', function (req, res, next) {
  if (!helper.isLoggedIn(req.user)) {
    res.redirect('/');
  }
  if (!req.xhr) {
    res.status(404).end();
    return next();
  }
  dbUtilReview.removeReview(req.params.id, req.user.id, function () {
    res.end();
  });
});

router.post('/update/:id', function (req, res, next) {
  if (!helper.isLoggedIn(req.user)) {
    res.redirect('/');
  }
  dbUtilReview.updateReview(
    req.params.id,
    req.user.id,
    {
      stars: req.body.stars,
      description: req.body.description
    },
    function() {
      res.redirect('/reviews/'+ req.body.id);
    });
});

module.exports = router;
