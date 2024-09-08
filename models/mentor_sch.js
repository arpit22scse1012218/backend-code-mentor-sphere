const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const MentorSchema = new Schema({
    mentor_name: String,
    image: String,
    field: String,
    email: String,
    description: String,
    
    googleMeetLink: String, // New field for Google Meet link

    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

// Middleware to delete reviews associated with the mentor when the mentor is deleted
MentorSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        });
    }
});

module.exports = mongoose.model('Mentor', MentorSchema);
