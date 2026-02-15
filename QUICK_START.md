# 🚀 Quick Start - Deploy in 30 Minutes

This is the fastest path to get your portfolio live with your Porkbun domain.

---

## Prerequisites (5 minutes)

✅ **You already have:**
- Porkbun domain purchased
- Code ready on your machine

📝 **You need to create:**
1. GitHub account → [github.com/signup](https://github.com/signup)
2. Vercel account → [vercel.com/signup](https://vercel.com/signup) (use GitHub login)

---

## Step 1: Push to GitHub (5 minutes)

```bash
# In your project directory
git add .
git commit -m "Ready for deployment"

# Create new repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
git push -u origin main
```

---

## Step 2: Deploy to Vercel (10 minutes)

### A. Import Project
1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import" next to your GitHub repo
3. Keep default settings, click "Deploy"
4. Wait 2-3 minutes ⏳

### B. Add Environment Variables (Optional)
If using Spotify widget:
1. Go to **Settings** → **Environment Variables**
2. Add:
   - `SPOTIFY_CLIENT_SECRET` = (your secret)
   - `SPOTIFY_REFRESH_TOKEN` = (your token)
3. Redeploy if needed

### C. Test Vercel URL
Visit: `https://your-project.vercel.app`
Make sure everything works! ✅

---

## Step 3: Connect Your Domain (15 minutes)

### A. In Vercel
1. Go to **Settings** → **Domains**
2. Click "Add Domain"
3. Enter: `yourdomain.com`
4. Copy the DNS records shown (keep this page open)

### B. In Porkbun
1. Log into [porkbun.com](https://porkbun.com/account/domainsSpeedy)
2. Click your domain
3. Go to "DNS Records"
4. **Delete** existing A and CNAME records for @ and www
5. **Add new records:**

   ```
   Type: A
   Host: @ (or blank)
   Answer: 76.76.21.21
   TTL: 600
   ```

   ```
   Type: CNAME
   Host: www
   Answer: cname.vercel-dns.com
   TTL: 600
   ```

6. Click "Save" / "Update"

### C. Wait for DNS
- Check: [whatsmydns.net](https://whatsmydns.net)
- Enter your domain
- Wait until it shows the correct IP everywhere
- Usually takes 15 min - 2 hours

### D. Verify in Vercel
1. Back in Vercel, refresh the domains page
2. Wait for green checkmark ✅
3. SSL certificate auto-provisions (up to 1 hour)

---

## Step 4: Test Your Site (5 minutes)

Visit your domain:
- `https://yourdomain.com` ✅
- `https://www.yourdomain.com` ✅

**Test checklist:**
- [ ] Site loads with HTTPS (green padlock)
- [ ] ChatInterface works
- [ ] Language toggle works (ES/EN)
- [ ] Email copy button works
- [ ] LinkedIn link works
- [ ] Mobile responsive

---

## Done! 🎉

Your portfolio is now live at your custom domain!

---

## What to Do Next

### Immediate:
- Update LinkedIn with your portfolio URL
- Share on social media
- Add to resume

### This Week:
- Test on different devices
- Ask friends for feedback
- Run Lighthouse audit (aim for 90+ scores)

### Ongoing:
- Update projects as you build
- Keep dependencies updated: `npm outdated`
- Monitor with Vercel Analytics (free)

---

## If Something Goes Wrong

### Domain not loading?
- **Wait longer** - DNS can take up to 48 hours
- **Check DNS**: [whatsmydns.net](https://whatsmydns.net)
- **Clear browser cache**: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

### SSL certificate error?
- **Wait** - Can take up to 1 hour after DNS propagates
- **Check Vercel**: Domain should show "Valid certificate"

### Site not working?
- **Check Vercel logs**: Project → Deployments → Click deployment → View logs
- **Check browser console**: F12 → Console tab

### Need help?
- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
- Porkbun Support: support@porkbun.com

---

## Detailed Guides

For more information:
- 📖 **Full Guide**: `DEPLOYMENT_GUIDE.md` (comprehensive 7-part guide)
- ✅ **Checklist**: `DEPLOYMENT_CHECKLIST.md` (step-by-step)
- 🎵 **Spotify Setup**: `SPOTIFY_SETUP.md` (if using widget)

---

**Estimated Total Time**: 30-60 minutes (+ DNS propagation wait)

Good luck! 🚀
