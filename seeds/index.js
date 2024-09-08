const mongoose = require('mongoose');
const Mentor = require('../models/mentor_sch'); // Adjust the path if needed

mongoose.connect('mongodb://localhost:27017/mentor-connect', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

const seedMentors = async () => {
    await Mentor.deleteMany({}); // Clears existing data

    const mentor1 = new Mentor({
        mentor_name: 'John Doe',
        image: 'https://example.com/image1.jpg',
        field: 'Web Development',
        email: 'john@example.com',
        description: 'Experienced web developer specializing in front-end technologies.',
        googleMeetLink: 'https://meet.google.com/mwx-vgbm-ubx', // Google Meet link
        author: '64a3c7db6a7f6c7f8c35b6a7' // Example author ID
    });

    const mentor2 = new Mentor({
        mentor_name: 'Jane Smith',
        image: 'https://example.com/image2.jpg',
        field: 'Data Science',
        email: 'jane@example.com',
        description: 'Data scientist with a focus on machine learning and AI.',
        googleMeetLink: 'https://meet.google.com/mwx-vgbm-ubx', // Google Meet link
        author: '64a3c7db6a7f6c7f8c35b6b7' // Example author ID
    });

    await mentor1.save();
    await mentor2.save();
};

seedMentors().then(() => {
    mongoose.connection.close();
});
