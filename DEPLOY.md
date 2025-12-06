# 🚀 Deployment Guide - Series Event Layer

This guide covers multiple deployment options for the Series Event Layer prototype.

## ⚡ Quick Deploy - One Command

```powershell
# Run the deployment script
.\deploy-railway.ps1
```

Or manually:

```powershell
# Install Railway CLI (if not installed)
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy!
railway up
```

---

## ⚡ Quick Deploy Options

### Option 1: Railway (Recommended - Easiest)

Railway supports Docker Compose natively and is perfect for multi-service apps.

#### Steps:

1. **Install Railway CLI:**
   ```bash
   npm i -g @railway/cli
   ```

2. **Login:**
   ```bash
   railway login
   ```

3. **Deploy:**
   ```bash
   # Initialize Railway project
   railway init
   
   # Link to existing project (if you created one on web)
   railway link
   
   # Deploy all services
   railway up
   ```

4. **Add PostgreSQL Service:**
   - Go to Railway dashboard: https://railway.app
   - Click "New Project"
   - Add "PostgreSQL" service
   - Copy the `DATABASE_URL` environment variable

5. **Set Environment Variables:**
   ```bash
   railway variables set DATABASE_URL="your-postgres-url"
   railway variables set SERIES_API_KEY="your-api-key"
   railway variables set KAFKA_BROKER="kafka:9092"
   ```

6. **View Logs:**
   ```bash
   railway logs
   ```

**Pros:** Easy, free tier, automatic HTTPS, managed PostgreSQL
**Cons:** Kafka can be resource-intensive on free tier

---

### Option 2: Render (Good Alternative)

Render also supports Docker Compose and has good free tier.

#### Steps:

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO
   git push -u origin main
   ```

2. **Create Render Account:**
   - Go to https://render.com
   - Sign up with GitHub

3. **Create New Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repo
   - Settings:
     - **Name:** series-event-layer
     - **Root Directory:** (leave empty)
     - **Environment:** Docker
     - **Dockerfile Path:** Dockerfile.production
     - **Docker Compose File:** docker-compose.production.yml
     - **Plan:** Free (or Starter)

4. **Add PostgreSQL Database:**
   - Click "New +" → "PostgreSQL"
   - Copy the connection string

5. **Set Environment Variables:**
   In your Web Service settings:
   - `DATABASE_URL` = (from PostgreSQL service)
   - `SERIES_API_KEY` = your-key
   - `KAFKA_BROKER` = kafka:9092
   - `POSTGRES_HOST` = postgres
   - `POSTGRES_DB` = series_db
   - `POSTGRES_USER` = (from PostgreSQL)
   - `POSTGRES_PASSWORD` = (from PostgreSQL)

6. **Deploy:**
   - Click "Manual Deploy" → "Deploy latest commit"
   - Wait for build to complete

**Pros:** Free tier, automatic HTTPS, managed PostgreSQL
**Cons:** Free tier has limitations (sleeps after inactivity)

---

### Option 3: Fly.io (Best for Multi-Region)

Fly.io is excellent for deploying multi-service apps globally.

#### Steps:

1. **Install Fly CLI:**
   ```bash
   # Windows (PowerShell)
   powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
   ```

2. **Login:**
   ```bash
   fly auth login
   ```

3. **Initialize Fly App:**
   ```bash
   fly launch
   ```
   - Follow prompts to create app
   - Choose region
   - Don't deploy yet

4. **Create fly.toml:**
   See `fly.toml` file in repo

5. **Deploy:**
   ```bash
   fly deploy
   ```

**Pros:** Global edge deployment, great performance
**Cons:** More complex setup

---

### Option 4: Simplest - Vercel + Railway Backend

For fastest deployment, split frontend and backend:

#### Frontend (Vercel):
```bash
cd nodejs_frontend
vercel
```

#### Backend (Railway):
- Deploy Python matcher to Railway
- Use Railway PostgreSQL
- Use Redis instead of Kafka (simpler)

---

## 🔧 Environment Variables Needed

All deployments need these environment variables:

```env
# Database (use managed PostgreSQL from platform)
DATABASE_URL=postgresql://user:pass@host:5432/dbname
POSTGRES_HOST=postgres
POSTGRES_DB=series_db
POSTGRES_USER=user
POSTGRES_PASSWORD=password

# Kafka (internal, use service name)
KAFKA_BROKER=kafka:9092
KAFKA_TOPIC_INTENT=series_event_intents
KAFKA_TOPIC_NOTIFY=series_frontend_notify

# Series API
SERIES_API_KEY=your-hackathon-api-key

# Node.js
NODE_ENV=production
PORT=3000
```

---

## 📦 Simplified Deployment (No Kafka)

For faster deployment without Kafka complexity, see `deploy-simple.md` for Redis-based version.

---

## 🐛 Troubleshooting

### Kafka Issues:
- **Problem:** Kafka won't start on free tier
- **Solution:** Use Redis Streams or RabbitMQ instead (see simplified version)

### Database Connection:
- **Problem:** Can't connect to PostgreSQL
- **Solution:** Check `DATABASE_URL` format, ensure network access is allowed

### Port Conflicts:
- **Problem:** Port already in use
- **Solution:** Change `PORT` environment variable

---

## 🎯 Recommended for Hackathon

**Best Choice: Railway**

1. Fastest setup (5 minutes)
2. Free tier with PostgreSQL
3. Automatic HTTPS
4. Easy environment variable management
5. Real-time logs

Just run:
```bash
npm i -g @railway/cli
railway login
railway init
railway up
```

Then add PostgreSQL service from dashboard and set `DATABASE_URL`!

---

## 📝 Post-Deployment Checklist

- [ ] Frontend accessible at public URL
- [ ] Database initialized (check logs)
- [ ] Kafka topics created (check logs)
- [ ] Python matcher connected (check logs)
- [ ] Test event intent submission
- [ ] Verify matching works
- [ ] Check notifications in frontend

---

Need help? Check logs with:
```bash
railway logs        # Railway
render logs         # Render  
fly logs            # Fly.io
```

