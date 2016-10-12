var Sequelize = require('sequelize');
var dbReview = require('../models/review').getModel();
var dbUser = require('../models/user').getModel();

exports.createReview = function(review, callback) {
  dbReview.create({
    idReviewer: review.idReviewer,
    idReviewee: review.idReviewee,
    createdAt: new Date(),
    stars: review.stars || 0,
    description: review.description,
    moduleCode: review.moduleCode,
  }).then(callback);
}

exports.findReview = function(option, callback) {
  var dbOption = {
    where: {},
    include: [
      {
        model: dbUser,
        as: 'reviewer',
        where: {id: Sequelize.col('reviews.idReviewer')},
        required: false
      },
      {
        model: dbUser,
        as: 'reviewee',
        where: {id: Sequelize.col('reviews.idReviewee')},
        required: false
      }
    ],
    limit: option.limit || 10,
    offset: option.offset || 0
  };
  if (option.reviewer)
    dbOption.where.idReviewer = String(option.reviewer);
  if (option.reviewee)
    dbOption.where.idReviewee = String(option.reviewee);
  dbReview.findAll(dbOption).then(function (data) {
    callback(data.map(function(review) {
      var review_obj = {
        id: review.id,
        idReviewee: review.idReviewee,
        idReviewer: review.idReviewer,
        moduleCode: review.moduleCode,
        stars: review.stars,
        semester: review.semester,
        description: review.description
      };
      if (review.reviewee)
        review_obj.reviewee = {
          id: review.reviewee.id,
          fbId: review.reviewee.fbId,
          matricNumber: review.reviewee.matricNumber,
          name: review.reviewee.name
        };
      if (review.reviewer)
        review_obj.reviewer = {
          id: review.reviewer.id,
          fbId: review.reviewer.fbId,
          matricNumber: review.reviewer.matricNumber,
          name: review.reviewer.name
        };
      return review_obj;
    }));
  });
}

exports.removeReview = function(reviewId, reviewer, callback) {
  dbReview.destroy({
    where: {
      id: reviewId,
      idReviewer: reviewer
    }
  }).then(callback);
}

exports.updateReview = function(reviewId, reviewer, review, callback) {
  dbReview.update({
    stars: review.stars,
    description: review.description
  }, {
    where: {
      id: reviewId,
      idReviewer: reviewer
    }
  }).then(callback);
};
