# Deploy ClashImposter to Render

This guide will walk you through deploying your multiplayer ClashImposter game to Render.

## Prerequisites

- A GitHub account
- A Render account (free tier works fine!)
- Your code pushed to a GitHub repository

## Step 1: Push Your Code to GitHub

1. **Initialize git repository** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Ready for deployment"
   ```

2. **Create a new repository on GitHub**:
   - Go to https://github.com/new
   - Name it `clash-imposter` (or any name you prefer)
   - Don't initialize with README (you already have one)
   - Click "Create repository"

3. **Push your code**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/clash-imposter.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Deploy on Render

### Option A: Using render.yaml (Recommended - Automatic Setup)

1. **Go to Render Dashboard**:
   - Visit https://dashboard.render.com
   - Sign in or create a free account

2. **Create New Web Service**:
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect your `render.yaml` file
   - Click "Apply"

3. **Wait for deployment**:
   - Render will build and deploy automatically
   - This takes 2-5 minutes
   - You'll see the build logs in real-time

4. **Get your URL**:
   - Once deployed, you'll see your app URL (e.g., `https://clashimposter.onrender.com`)
   - Click it to open your game!

### Option B: Manual Setup

1. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your repo

2. **Configure the service**:
   - **Name**: `clashimposter` (or your choice)
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: Leave empty
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

3. **Add Environment Variables**:
   - Click "Advanced" → "Add Environment Variable"
   - Add:
     - `NODE_ENV` = `production`
     - `PORT` = `10000`

4. **Create Web Service**:
   - Click "Create Web Service"
   - Wait for deployment (2-5 minutes)

## Step 3: Test Your Deployment

1. **Open your app**:
   - Click the URL Render provides (e.g., `https://clashimposter.onrender.com`)

2. **Test multiplayer**:
   - Create a lobby
   - Share the URL with friends (or open in multiple tabs/devices)
   - Join the lobby with the code
   - Start a game!

## Important Notes

### Free Tier Limitations

- **Cold Starts**: Free tier services sleep after 15 minutes of inactivity
  - First request after sleep takes ~30 seconds to wake up
  - Subsequent requests are instant

- **Monthly Limits**: 750 hours/month (enough for continuous operation!)

### Custom Domain (Optional)

If you want a custom domain (e.g., `clashimposter.com`):

1. Go to your service settings on Render
2. Click "Custom Domain"
3. Add your domain
4. Update your domain's DNS settings as instructed

## Troubleshooting

### Build Failed

**Check build logs**:
- Look for errors in the Render dashboard
- Common issues:
  - Missing dependencies → Check `package.json`
  - Build timeout → Upgrade to paid tier or optimize build

### App Not Loading

**Check the logs**:
- In Render dashboard, click "Logs"
- Look for error messages
- Common issues:
  - Port not set correctly (should be `10000`)
  - Environment variables missing

### Socket Connection Failed

**This is normal on first load**:
- Free tier services sleep after inactivity
- First connection takes ~30 seconds to wake up
- After that, it's instant

**If still failing**:
- Check browser console for errors
- Verify the socket is connecting to the correct URL
- Make sure CORS is configured correctly (already done in code)

## Updating Your Deployment

Whenever you make changes:

```bash
git add .
git commit -m "Your update message"
git push
```

Render will automatically:
1. Detect the push
2. Rebuild your app
3. Deploy the new version
4. Zero downtime!

## Monitoring

**View logs**:
- Go to Render dashboard
- Click your service
- Click "Logs" tab
- See real-time server logs

**View stats**:
- Dashboard shows:
  - Request count
  - Memory usage
  - CPU usage
  - Response times

## Cost

**Free Tier**:
- ✅ 750 hours/month
- ✅ Automatic HTTPS
- ✅ Continuous deployment
- ✅ Custom domains
- ⚠️ Services sleep after 15 min inactivity

**Upgrade ($7/month)**:
- ✅ No sleep
- ✅ Always instant
- ✅ More resources
- ✅ Better for production use

## Next Steps

Once deployed, you can:

1. **Share the URL** with friends
2. **Add to home screen** on mobile (PWA support)
3. **Customize the game** and push updates
4. **Monitor usage** in Render dashboard
5. **Upgrade plan** if you need always-on hosting

## Support

- **Render Docs**: https://docs.render.com
- **Render Discord**: https://discord.gg/render
- **GitHub Issues**: Create an issue in your repo

---

## Quick Reference

**Deployment Commands**:
```bash
# First time
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_URL
git push -u origin main

# Updates
git add .
git commit -m "Update message"
git push
```

**Your URLs**:
- **Live App**: `https://clashimposter.onrender.com` (or your custom name)
- **Dashboard**: https://dashboard.render.com
- **GitHub**: `https://github.com/YOUR_USERNAME/clash-imposter`

---

🎉 **Congratulations!** Your multiplayer game is now live on the internet!

Share your lobby code with friends and have fun! 🎮
