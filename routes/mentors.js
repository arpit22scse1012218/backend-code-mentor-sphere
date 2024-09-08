const express = require('express');
const router = express.Router();
const Mentor = require('../models/mentor_sch');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateMentor } = require('../middleware'); // Importing validateMentor from middleware

// Route to list all mentors
router.get('/', catchAsync(async (req, res) => {
    const mentors = await Mentor.find({});
    res.render('mentors/index', { mentors });
}));

// Route to render new mentor form
router.get('/new', isLoggedIn, (req, res) => {
    res.render('mentors/new');
});

// Route to create a new mentor
router.post('/', isLoggedIn, validateMentor, catchAsync(async (req, res) => {
    const mentor = new Mentor(req.body.mentor);
    mentor.author = req.user._id;
    await mentor.save();
    req.flash('success', 'Successfully added a new mentor!');
    res.redirect(`/mentors/${mentor._id}`);
}));

// Route to show a specific mentor by id
router.get('/:id', catchAsync(async (req, res) => {
    const mentor = await Mentor.findById(req.params.id)
        .populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        })
        .populate('author');

    if (!mentor) {
        req.flash('error', 'Cannot find that mentor!');
        return res.redirect('/mentors');
    }
    res.render('mentors/show', { mentor });
}));


// Route to render edit form for a mentor
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const mentor = await Mentor.findById(req.params.id);
    if (!mentor) {
        req.flash('error', 'Cannot find that mentor!');
        return res.redirect('/mentors');
    }
    res.render('mentors/edit', { mentor });
}));

// Route to update a mentor
router.put('/:id', isLoggedIn, isAuthor, validateMentor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const mentor = await Mentor.findByIdAndUpdate(id, { ...req.body.mentor });
    req.flash('success', 'Successfully updated mentor!');
    res.redirect(`/mentors/${mentor._id}`);
}));

// Route to delete a mentor
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Mentor.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted mentor!');
    res.redirect('/mentors');
}));

module.exports = router;
