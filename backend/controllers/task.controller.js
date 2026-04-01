const { redisClient } = require('../config/redis');
const Task = require('../models/task.model');
const express = require('express');
const app = express();

// Routes
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Get all tasks (with Redis caching)
app.get('/tasks', async (req, res) => {
  try {
    console.log('🛠️  Checking Redis cache for tasks');
    // Check Redis cache first
    const cachedTasks = await redisClient.get('tasks');
    
    if (cachedTasks) {
      console.log('📦 Serving from Redis cache');
      return res.json({
        source: 'cache',
        data: JSON.parse(cachedTasks)
      });
    }

    // If not in cache, fetch from MongoDB
    console.log('🔍 Fetching from MongoDB');
    const tasks = await Task.find().sort({ createdAt: -1 });
    
    // Store in Redis cache for 60 seconds
    await redisClient.setEx('tasks', 60, JSON.stringify(tasks));
    
    res.json({
      source: 'database',
      data: tasks
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new task
app.post('/tasks', async (req, res) => {
  try {
    const { title, description } = req.body;
    
    const newTask = new Task({
      title,
      description
    });

    await newTask.save();
    
    // Invalidate cache
    await redisClient.del('tasks');
    console.log('🗑️ Cache invalidated');
    
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update task
app.put('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const task = await Task.findByIdAndUpdate(id, updates, { new: true });
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    // Invalidate cache
    await redisClient.del('tasks');
    
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete task
app.delete('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const task = await Task.findByIdAndDelete(id);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    // Invalidate cache
    await redisClient.del('tasks');
    
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Cache stats endpoint
app.get('/cache-stats', async (req, res) => {
  try {
    console.log('🛠️  Checking Redis cache for tasks');
    const info = await redisClient.info();
    console.log('📦 Serving from Redis cache');
    const cachedTasks = await redisClient.get('tasks');
    
    if (!cachedTasks) {
      return res.json({
        cacheStatus: 'not connected',
        hasCachedTasks: false,
        tasksInCache: 0
      });
    }
    
    res.json({
      cacheStatus: 'connected',
      hasCachedTasks: !!cachedTasks,
      tasksInCache: cachedTasks ? JSON.parse(cachedTasks).length : 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/version', (req, res) => {
  res.json({ version: '2.0', message: 'Updated version!' });
});

module.exports = app;