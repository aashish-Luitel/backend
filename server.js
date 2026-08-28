require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Review = require('./models/Review');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vivobook';

// Middleware
app.use(cors()); // allow frontend on Netlify to call backend
app.use(express.json());
app.use(express.static('../')); // serve frontend if needed

// In-memory fallback when MongoDB not connected (so demo works without Atlas)
let memoryReviews = [];
let dbReady = false;

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', db: dbReady ? 'mongodb' : 'memory', message: 'Vivobook API running', reviews: '/api/reviews' });
});

// GET all reviews - newest first
app.get('/api/reviews', async (req, res) => {
  try {
    if (dbReady) {
      const reviews = await Review.find().sort({ date: -1 }).limit(100);
      return res.json(reviews);
    }
    res.json(memoryReviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new review
app.post('/api/reviews', async (req, res) => {
  try {
    const { name, stars, text } = req.body;
    if (!name || !text || !stars) return res.status(400).json({ error: 'name, stars, text required' });
    if (stars < 1 || stars > 5) return res.status(400).json({ error: 'stars must be 1-5' });
    if (name.length > 30 || text.length > 300) return res.status(400).json({ error: 'max length exceeded' });
    if (dbReady) {
      const review = await Review.create({ name: name.trim(), stars: Number(stars), text: text.trim() });
      return res.status(201).json(review);
    }
    const review = { _id: Date.now().toString(), name: name.trim(), stars: Number(stars), text: text.trim(), date: new Date() };
    memoryReviews.unshift(review);
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE single review (optional)
app.delete('/api/reviews/:id', async (req, res) => {
  try {
    if (dbReady) await Review.findByIdAndDelete(req.params.id);
    else memoryReviews = memoryReviews.filter(r => r._id !== req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE all reviews (admin - for demo)
app.delete('/api/reviews', async (req, res) => {
  try {
    if (dbReady) await Review.deleteMany({});
    else memoryReviews = [];
    res.json({ ok: true, cleared: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Connect MongoDB then start server
mongoose.connect(MONGODB_URI)
  .then(() => {
    dbReady = true;
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT} (DB: MongoDB)`));
  })
  .catch(err => {
    console.error('MongoDB not configured - using memory storage. To persist, add MONGODB_URI to .env');
    console.error('Error:', err.message);
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT} (DB: memory - reviews reset on restart)`));
  });
