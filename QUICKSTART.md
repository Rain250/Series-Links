# 🚀 Quick Deploy to Cloud

## Fastest Way: Railway (5 minutes)

### Step 1: Push to GitHub

```powershell
# Initialize git (if not done)
git init
git add .
git commit -m "Initial commit"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 2: Deploy to Railway

**Option A: Via Web (Easiest)**

1. Go to https://railway.app
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Railway will auto-detect docker-compose.yml
6. Add PostgreSQL service:
   - Click "+ New"
   - Select "Database" → "PostgreSQL"
7. Set environment variables:
   - Go to your service → Variables
   - Add `DATABASE_URL` (copy from PostgreSQL service)
   - Add `SERIES_API_KEY` = your-key
8. Deploy! Wait for build to complete
9. Your app will be live at `https://your-app.up.railway.app`

**Option B: Via CLI**

```powershell
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize
railway init

# Deploy
railway up

# Get URL
railway domain
```

---

## Alternative: Render (Also Free)

1. Push code to GitHub (same as Step 1 above)
2. Go to https://render.com
3. Click "New +" → "Web Service"
4. Connect GitHub repo
5. Settings:
   - **Name:** series-event-layer
   - **Environment:** Docker
   - **Dockerfile Path:** `Dockerfile.production`
6. Add PostgreSQL:
   - "New +" → "PostgreSQL"
   - Copy connection string
7. Set environment variables in Web Service
8. Deploy!

---

## ⚠️ Important Notes

1. **Kafka on Free Tier:**
   - Kafka is resource-intensive
   - Free tier may have limitations
   - If it fails, consider using Redis Streams (simpler alternative)

2. **Database:**
   - Use managed PostgreSQL from Railway/Render
   - Copy the `DATABASE_URL` connection string
   - Set it as environment variable

3. **First Deploy:**
   - Takes 5-10 minutes
   - Subsequent deploys are faster

---

## 🎯 What You Get

After deployment:
- ✅ Public HTTPS URL
- ✅ Auto-scaling
- ✅ Database included
- ✅ Real-time logs
- ✅ Zero server management

---

## 📱 Access Your App

Once deployed, Railway/Render will give you a URL like:
```
https://series-event-layer-production.up.railway.app
```

Open it in your browser and start matching! 🎉

---

## 🐛 Troubleshooting

**Build fails?**
- Check logs: `railway logs` or Render dashboard
- Ensure all files are committed to git
- Verify Dockerfile paths are correct

**Can't connect to database?**
- Check `DATABASE_URL` is set correctly
- Ensure PostgreSQL service is running
- Verify network access in Railway/Render

**Kafka not working?**
- Free tier may not support Kafka well
- Check container logs
- Consider Redis Streams alternative (simpler)

---

Need help? Check the full [DEPLOY.md](./DEPLOY.md) guide!

