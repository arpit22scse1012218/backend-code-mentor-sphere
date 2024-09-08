const express = require('express');
const router = express.Router({ mergeParams: true });

const Mentor = require('../models/mentor_sch');
const Review = require('../models/review');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

// Route to create a new review for a mentor
router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const mentor = await Mentor.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;  // Attach the logged-in user as the author of the review
    mentor.reviews.push(review);
    await review.save();
    await mentor.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/mentors/${mentor._id}`);
}));

// Route to delete a review for a mentor
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Mentor.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review');
    res.redirect(`/mentors/${id}`);
}));

module.exports = router;
