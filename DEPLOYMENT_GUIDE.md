# 🚀 OneTool Deployment Guide (Vercel)

## Why Vercel?
- ✅ Free tier perfect for portfolio projects
- ✅ Automatic deployments from GitHub
- ✅ Built-in environment variables
- ✅ Global CDN
- ✅ Zero config for Next.js

---

## Step-by-Step Deployment

### Step 1: Prepare Your Repository

1. **Ensure `.env.local` is in `.gitignore`**
```bash
# Check if it's already there
cat .gitignore | grep .env.local

# If not, add it
echo ".env.local" >> .gitignore
```

2. **Commit all changes**
```bash
git add .
git commit -m "feat: prepare for deployment"
git push origin main
```

---

### Step 2: Set Up MongoDB Atlas (Free)

**If you don't have a cloud MongoDB:**

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up / Log in
3. Create a **FREE cluster** (M0 Sandbox)
4. Click **"Connect"** → **"Connect your application"**
5. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/onetool?retryWrites=true&w=majority
   ```
6. Replace `<username>` and `<password>` with your credentials

**Security Settings:**
- Go to **Network Access** → Add IP: `0.0.0.0/0` (allow all for now)
- Go to **Database Access** → Create user with read/write permissions

---

### Step 3: Deploy to Vercel

1. **Go to [Vercel](https://vercel.com)**
2. **Sign up with GitHub** (easiest)
3. **Click "Add New Project"**
4. **Import your OneTool repository**
5. **Configure Project:**
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

6. **Add Environment Variables** (CRITICAL):

Click **"Environment Variables"** and add:

```env
MONGODB_URI=mongodb+srv://your-connection-string
JWT_SECRET=your-super-secret-key-min-32-characters-long
API_TESTER_DAILY_LIMIT=100
NODE_ENV=production
```

**Generate JWT_SECRET:**
```bash
# In terminal, run:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

7. **Click "Deploy"**

⏳ Wait 2-3 minutes...

✅ **Done!** Your app is live at: `https://onetool-xyz.vercel.app`

---

### Step 4: Test Your Deployment

1. **Visit your Vercel URL**
2. **Test database connection:**
   ```
   https://your-app.vercel.app/api/test-db
   ```
   Should return: `{ "status": "ok", "message": "Database connected" }`

3. **Register a test account:**
   - Go to `/auth/register`
   - Create account
   - Login at `/auth/login`

4. **Test tools:**
   - Dashboard should load
   - Press ⌘K (command palette should open)
   - Try JSON Formatter
   - Try API Tester

---

### Step 5: Update README with Live Demo

```bash
# Edit README.md, update the hero section:
```

Change:
```markdown
[Live Demo](#) • [Documentation](docs/) • [Report Bug](issues)
```

To:
```markdown
[Live Demo](https://your-app.vercel.app) • [Documentation](docs/) • [Report Bug](issues)
```

Commit and push:
```bash
git add README.md
git commit -m "docs: add live demo link"
git push origin main
```

---

## Troubleshooting

### Issue 1: "Database connection failed"
**Solution:**
- Check MongoDB Atlas IP whitelist (should be `0.0.0.0/0`)
- Verify `MONGODB_URI` in Vercel environment variables
- Check MongoDB user has read/write permissions

### Issue 2: "JWT verification failed"
**Solution:**
- Ensure `JWT_SECRET` is set in Vercel
- Must be at least 32 characters
- Redeploy after adding env vars

### Issue 3: "Module not found" errors
**Solution:**
- Check `package.json` has all dependencies
- Run `npm install` locally to verify
- Commit `package-lock.json`

### Issue 4: Build fails
**Solution:**
- Check build logs in Vercel dashboard
- Run `npm run build` locally first
- Fix any TypeScript/ESLint errors

---

## Custom Domain (Optional)

1. **Buy domain** (Namecheap, GoDaddy, etc.)
2. **In Vercel:**
   - Go to Project Settings → Domains
   - Add your domain
   - Follow DNS instructions
3. **Update README** with custom domain

---

## Automatic Deployments

**Vercel automatically deploys when you push to GitHub:**

```bash
# Make changes
git add .
git commit -m "feat: add new tool"
git push origin main

# Vercel automatically:
# 1. Detects push
# 2. Builds project
# 3. Deploys to production
# 4. Updates your URL
```

**Preview Deployments:**
- Every PR gets a preview URL
- Test before merging to main

---

## Environment Variables Reference

| Variable | Required | Example | Notes |
|----------|----------|---------|-------|
| `MONGODB_URI` | ✅ | `mongodb+srv://...` | MongoDB Atlas connection string |
| `JWT_SECRET` | ✅ | `a1b2c3d4e5f6...` | Min 32 chars, use crypto.randomBytes |
| `API_TESTER_DAILY_LIMIT` | ❌ | `100` | Max API requests per user/day |
| `NODE_ENV` | ✅ | `production` | Enables production optimizations |

---

## Post-Deployment Checklist

- [ ] App loads at Vercel URL
- [ ] Database connection works (`/api/test-db`)
- [ ] Can register new account
- [ ] Can login
- [ ] Dashboard loads
- [ ] Command palette works (⌘K)
- [ ] JSON Formatter works
- [ ] API Tester works
- [ ] Image Compressor works
- [ ] Mobile responsive
- [ ] README updated with live demo link

---

## Performance Optimization (After Deployment)

1. **Run Lighthouse Audit:**
   - Open Chrome DevTools
   - Go to Lighthouse tab
   - Run audit
   - Aim for 90+ scores

2. **Check Bundle Size:**
   ```bash
   npm run build
   # Check .next/analyze output
   ```

3. **Monitor Performance:**
   - Vercel Analytics (free)
   - Check response times
   - Monitor error rates

---

## Security Checklist

- [x] `JWT_SECRET` is strong (32+ chars)
- [x] `.env.local` not committed to Git
- [x] MongoDB user has minimal permissions
- [x] CORS configured properly
- [x] Rate limiting enabled (API Tester)
- [x] Input validation on all API routes
- [x] httpOnly cookies for JWT

---

## Next Steps After Deployment

1. **Take screenshots** of live app
2. **Record demo GIF** showing features
3. **Update README** with screenshots
4. **Post on LinkedIn** with live demo link
5. **Share on Twitter/Reddit** (r/webdev, r/nextjs)
6. **Add to portfolio** website

---

## Vercel Dashboard Tips

**Useful Features:**
- **Analytics** → See visitor stats
- **Logs** → Debug production issues
- **Deployments** → Rollback if needed
- **Environment Variables** → Update without redeploying code

**Pro Tip:** Enable Vercel Analytics for free visitor tracking.

---

## Cost Breakdown

**Free Tier Includes:**
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Preview deployments
- ✅ Analytics (basic)

**MongoDB Atlas Free Tier:**
- ✅ 512MB storage
- ✅ Shared cluster
- ✅ Perfect for portfolio projects

**Total Cost: $0/month** 🎉

---

## Deployment Complete! 🚀

Your OneTool is now live and accessible worldwide.

**Next:** Take screenshots, record demo, update README, post on LinkedIn.

**You're ready to showcase this to recruiters!** 💼
