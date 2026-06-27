const express = require('express');
const cors = require('cors');
const path = require('path');
const { errorHandler } = require('./middleware/error.middleware');

// Route imports
const authRoutes = require('./routes/auth.routes');
const projectRoutes = require('./routes/project.routes');
const skillRoutes = require('./routes/skill.routes');
const blogRoutes = require('./routes/blog.routes');
const contactRoutes = require('./routes/contact.routes');
const settingRoutes = require('./routes/setting.routes');
const mediaRoutes = require('./routes/media.routes');
const chatbotRoutes = require('./routes/chatbot.routes');
const pool = require('./config/database');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/chat', chatbotRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('Portfolio API is running...');
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Portfolio API is running...',
    data: {
      environment: process.env.NODE_ENV || 'development',
      commit: process.env.RENDER_GIT_COMMIT || process.env.COMMIT_SHA || 'local',
      routes: {
        mediaUploads: '/api/media/uploads',
      },
    },
  });
});

// Database status check
app.get('/api/health/db', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ success: true, message: 'Database Connected' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Database Connection Error', error: err.message });
  }
});

// Error Handler
app.use(errorHandler);

module.exports = app;
