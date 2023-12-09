const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

// Connect to MongoDB (make sure MongoDB is running)
mongoose.connect('mongodb://localhost:27017/blog', { useNewUrlParser: true, useUnifiedTopology: true });

// Create a schema for posts
const postSchema = new mongoose.Schema({
    dham: String,
    content: String,
    timestamp: { type: Date, default: Date.now }
});

// Create a model for posts
const Post = mongoose.model('Post', postSchema);

// Middleware to parse JSON data
app.use(bodyParser.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));

// API endpoint to get posts for a specific dham
app.get('/posts/:dham', async (req, res) => {
    const { dham } = req.params;
    const posts = await Post.find({ dham }).sort({ timestamp: 'desc' });
    res.json(posts);
});

// API endpoint to add a new post
app.post('/posts', async (req, res) => {
    const { dham, content } = req.body;
    const newPost = new Post({ dham, content });
    await newPost.save();
    res.sendStatus(201);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
