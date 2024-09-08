const { mentorSchema, reviewSchema } = require('./schemas.js'); // Add mentor review schema
const ExpressError = require('./utils/ExpressError');
const Mentor = require('./models/mentor_sch');
const Review = require('./models/review'); // Add mentor review model

// Middleware to check if the user is logged in
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
};

// Middleware to validate mentor data against the mentor schema
module.exports.validateMentor = (req, res, next) => {
    const { error } = mentorSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

// Middleware to check if the current user is the author of the mentor profile
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const mentor = await Mentor.findById(id);
    if (!mentor.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/mentors/${id}`);
    }
    next();
};

// Middleware to validate review data against the review schema
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

// Middleware to check if the current user is the author of a review
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/mentors/${id}`);
    }
    next();
};
