
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [cacheStats, setCacheStats] = useState(null);
  const [dataSource, setDataSource] = useState('');

  useEffect(() => {
    fetchTasks();
    fetchCacheStats();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/tasks`);
      setTasks(response.data.data);
      setDataSource(response.data.source);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      alert('Error fetching tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchCacheStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/cache-stats`);
      setCacheStats(response.data);
    } catch (error) {
      console.error('Error fetching cache stats:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) {
      alert('Please enter a task title');
      return;
    }

    try {
      await axios.post(`${API_URL}/tasks`, newTask);
      setNewTask({ title: '', description: '' });
      fetchTasks();
      fetchCacheStats();
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Error creating task');
    }
  };

  const toggleComplete = async (task) => {
    try {
      await axios.put(`${API_URL}/tasks/${task._id}`, {
        completed: !task.completed
      });
      fetchTasks();
      fetchCacheStats();
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Error updating task');
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`);
      fetchTasks();
      fetchCacheStats();
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Error deleting task');
    }
  };

  return (
    <div className="App">
      <div className="container">
        <div className='left'>
        <header className="header">
          <h1>📝 MERN Task Manager</h1>
          <p>Full-Stack App with Docker, MongoDB & Redis</p>
        </header>

        <div className="stats-bar">
          <div className="stat">
            <span className="label">Data Source:</span>
            <span className={`badge ${dataSource === 'cache' ? 'cache' : 'database'}`}>
              {dataSource === 'cache' ? '📦 Redis Cache' : '🗄️ MongoDB'}
            </span>
          </div>
          {cacheStats && (
            <div className="stat">
              <span className="label">Cache Status:</span>
              <span className="badge success">✅ Connected</span>
            </div>
          )}
          {cacheStats && (
            <div className="stat">
              <span className="label">Tasks in Cache:</span>
              <span className="badge">{cacheStats.tasksInCache}</span>
            </div>
          )}
        </div>

        <div className="form-section">
          <h2>Add New Tasks</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Task Title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="input"
            />
            <textarea
              placeholder="Task Description (optional)"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              className="textarea"
              rows="3"
            />
            <button type="submit" className="btn btn-primary">
              ➕ Add Task
            </button>
          </form>
        </div>
        </div>

        <div className="tasks-section">
          <div className="tasks-header">
            <h2>Tasks ({tasks.length})</h2>
            <button onClick={fetchTasks} className="btn btn-secondary" disabled={loading}>
              {loading ? '⏳ Loading...' : '🔄 Refresh'}
            </button>
          </div>

          {loading ? (
            <div className="loading">Loading tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="empty-state">
              <p>No tasks yet. Create your first task above!</p>
            </div>
          ) : (
            <div className="tasks-list">
              {tasks.map((task) => (
                <div key={task._id} className={`task-card ${task.completed ? 'completed' : ''}`}>
                  <div className="task-content">
                    <h3>{task.title}</h3>
                    {task.description && <p>{task.description}</p>}
                    <small>
                      Created: {new Date(task.createdAt).toLocaleString()}
                    </small>
                  </div>
                  <div className="task-actions">
                    <button
                      onClick={() => toggleComplete(task)}
                      className={`btn ${task.completed ? 'btn-warning' : 'btn-success'}`}
                    >
                      {task.completed ? '↩️ Undo' : '✅ Complete'}
                    </button>
                    <button
                      onClick={() => deleteTask(task._id)}
                      className="btn btn-danger"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;