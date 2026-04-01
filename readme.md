# 📝 MERN Stack Task Manager with Docker

A full-stack Task Manager application built with MERN stack (MongoDB, Express, React, Node.js) and containerized using Docker Compose. Features Redis caching for improved performance and data persistence.

## 🚀 Features

- ✅ Full-stack MERN application
- 🐳 Multi-container Docker setup with Docker Compose
- 📦 Redis caching for optimized performance
- 💾 MongoDB for persistent data storage
- 🔄 Health checks for all services
- 📊 Data persistence using Docker volumes
- 🎨 Modern, responsive UI
- 🔌 Service dependency management

## 🏗️ Architecture

```
┌─────────────┐      ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │────▶│   Backend   │────▶│   MongoDB   │     │    Redis    │
│  (React)    │      │  (Express)  │     │ (Database)  │     │   (Cache)   │
│   Port 3000 │      │   Port 5000 │     │  Port 27017 │     │  Port 6379  │
└─────────────┘      └─────────────┘     └─────────────┘     └─────────────┘
```

## 📋 Prerequisites

- Docker (v20.10+)
- Docker Compose (v2.0+)
- Git

## 🛠️ Tech Stack

### Frontend
- React 18
- Axios
- CSS3

### Backend
- Node.js
- Express.js
- Mongoose (MongoDB ODM)
- Redis Client

### Database & Cache
- MongoDB 7.0
- Redis 7

## 📦 Project Structure

```
mern-docker-app/
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   ├── Dockerfile
│   ├── .gitignore
│   ├── .env.example
│   └── package.json
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   ├── redis.js
│   ├── controllers/
│   │   ├── task.controller.js
│   ├── models/
│   │   ├── task.model.js
│   ├── server.js
│   ├── Dockerfile
│   ├── .gitignore
│   ├── .env.example
│   └── package.json
├── screenshots/
├── dockerignore
├── docker-compose.yml
├── mongodb.env
├── redis.env
└── README.md
```

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/mern-docker-app.git
cd mern-docker-app
```

### 2. Set Up Environment Variables

```bash
# Backend
cd backend
cp .env.example .env

# Frontend
cd ../frontend
cp .env.example .env
cd ..
```

### 3. Build and Run with Docker Compose

```bash
# Build all services
docker-compose build

# Start all services in detached mode
docker-compose up -d

# View logs
docker-compose logs -f
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## 🎯 Usage

### Creating Tasks
1. Enter task title and description
2. Click "Add Task"
3. Task is saved to MongoDB and cache is invalidated

### Viewing Tasks
- First load fetches from MongoDB (🗄️ MongoDB badge)
- Subsequent loads within 60 seconds fetch from Redis (📦 Redis Cache badge)
- Cache automatically expires after 60 seconds

### Managing Tasks
- **Complete**: Mark task as done
- **Undo**: Revert completed task
- **Delete**: Remove task permanently
- **Refresh**: Manually reload tasks

## 🔧 Docker Commands

### View Running Containers
```bash
docker-compose ps
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
```

### Stop Services
```bash
docker-compose stop
```

### Stop and Remove Containers
```bash
docker-compose down
```

### Remove Containers and Volumes
```bash
docker-compose down -v
```

### Rebuild Specific Service
```bash
docker-compose up -d --build backend
```

## 🔍 Testing Service Connectivity

### MongoDB
```bash
# Connect to MongoDB shell
docker exec -it mern-mongodb mongosh

# Inside MongoDB shell
use taskmanager
db.tasks.find().pretty()
show collections
exit
```

### Redis
```bash
# Connect to Redis CLI
docker exec -it mern-redis redis-cli

# Inside Redis CLI
KEYS *
GET tasks
TTL tasks
INFO
exit
```

### Backend API
```bash
# Health check
curl http://localhost:5000/api/health

# Get tasks
curl http://localhost:5000/api/tasks

# Cache stats
curl http://localhost:5000/api/cache-stats
```

## 📊 Data Persistence Testing

### Test MongoDB Persistence
```bash
# Stop and remove MongoDB container
docker-compose stop mongodb
docker-compose rm -f mongodb

# Verify data volume exists
docker volume ls | grep mongodb

# Restart MongoDB
docker-compose up -d mongodb

# Verify data persisted
docker exec -it mern-mongodb mongosh taskmanager --eval "db.tasks.find().pretty()"
```

### Test Redis Persistence
```bash
# Stop and remove Redis container
docker-compose stop redis
docker-compose rm -f redis

# Verify data volume exists
docker volume ls | grep redis

# Restart Redis
docker-compose up -d redis

# Restart backend to reconnect
docker-compose restart backend
```

## 🔄 Redeploying Changes

### Update Application Code
```bash
# Make changes to backend/server.js or frontend/src/App.js

# Rebuild and restart specific service
docker-compose up -d --build backend  # For backend changes
docker-compose up -d --build frontend # For frontend changes
```

### Without Affecting Other Services
```bash
# Only restart one service
docker-compose restart backend

# Verify other services still running
docker-compose ps
```

## 📸 Screenshots

See the `screenshots/` folder for:
- Application interface
- Docker containers running
- MongoDB data
- Redis cache data
- Service logs
- Data persistence verification

## 🐛 Troubleshooting

### Services Won't Start
```bash
# Check logs
docker-compose logs

# Restart services
docker-compose restart
```

### Port Already in Use
```bash
# Stop conflicting services
sudo lsof -i :3000
sudo lsof -i :5000

# Or change ports in docker-compose.yml
```

### Cannot Connect to MongoDB/Redis
```bash
# Check if services are healthy
docker-compose ps

# Restart dependent services
docker-compose restart backend
```

### Clear All Data and Restart
```bash
docker-compose down -v
docker-compose up -d --build
```

## 📝 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/tasks` | Get all tasks (with caching) |
| POST | `/api/tasks` | Create new task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| GET | `/api/cache-stats` | Get Redis cache statistics |

## 🔐 Environment Variables

### Backend (.env)
```
PORT=5000
MONGO_URI=mongodb://mongodb:27017/taskmanager
REDIS_HOST=redis
REDIS_PORT=6379
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

### MongoDB (mongodb.env)
```
MONGO_INITDB_DATABASE=taskmanager
```

### Redis (redis.env)
```
REDIS_REPLICATION_MODE=master
```

## 🎓 Key Learning Outcomes

✅ Multi-container Docker application setup
✅ Docker Compose orchestration
✅ Service dependency management with health checks
✅ Data persistence using Docker volumes
✅ Redis caching implementation
✅ MongoDB integration with Node.js
✅ Full-stack MERN development
✅ Environment variable management
✅ Container networking

## 📄 License

MIT License - feel free to use this project for learning purposes.

## 👤 Author

[Your Name]
- GitHub: https://github.com/parthpromact)

## 🙏 Acknowledgments

- Docker Documentation
- MongoDB Documentation
- Redis Documentation
- React Documentation

---

**Note**: This project was created as part of a Docker Compose assignment to demonstrate multi-service application containerization with data persistence and caching.