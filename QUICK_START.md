# ⚡ QUICK START - Get Running in 5 Minutes

**Total Time**: ~5-10 minutes  
**Difficulty**: Beginner friendly  
**Final Result**: Full app running locally

---

## 🎯 Prerequisites (2 minutes)

Before starting, make sure you have:

### ✅ Check if you have Node.js
```bash
node --version   # Should show v16 or higher
npm --version    # Should show v8 or higher
```

If you don't see versions:
1. Download [Node.js v18 LTS](https://nodejs.org)
2. Install it
3. Restart your terminal

### ✅ Check if you have MongoDB (Optional - we'll use local for demo)
```bash
mongod --version
```

If you don't have it, that's OK! We'll skip it for now.

---

## 🚀 Run the App (3 minutes)

### Step 1: Open TWO terminals in `d:\okkkk` folder

**Terminal 1** (Backend):
```bash
cd d:\okkkk\backend
npm install
npm start
```

You should see:
```
✅ Server running on http://localhost:5000
❌ MongoDB Connection Failed (that's OK for demo)
```

**Terminal 2** (Frontend) - Open in NEW terminal:
```bash
cd d:\okkkk\frontend
npm install
npm start
```

You should see:
```
✅ Compiled successfully!
✅ Webpack compiled with warnings
✅ App running on http://localhost:3000
```

**Browser will auto-open:** http://localhost:3000 ✅

---

## 🎮 Test the App (2 minutes)

### Create a Test Account

1. **Signup** (click "Signup")
   - Email: `test@example.com`
   - Password: `password123`
   - Full Name: `Test User`
   - Phone: `1234567890`
   - Role: `customer` (default)

2. **Login** with your account

3. **Browse**: See dummy restaurants (hardcoded demo data)

4. **Add to Cart**: Click restaurant → Add items

5. **Checkout**: Cart → Enter address → Select payment

---

## 📝 Important Notes

### ⚠️ Database Connection Error
You'll see: `❌ MongoDB Connection Failed`

This is **NORMAL** for demo! The app still works:
- Frontend pages load ✅
- You can test UI/UX ✅
- Real data won't save (uses mock data)

### ✅ To use REAL database

**Option A: MongoDB Local**
```bash
# Install from: https://www.mongodb.com/try/download/community
# Then run in another terminal:
mongod
```

**Option B: MongoDB Atlas (Recommended - Cloud)**
1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create free account
3. Create cluster
4. Copy connection string
5. Paste in `backend/.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster...
```
6. Restart backend

---

## 🧪 What to Test

### ✅ Try These Features

| Feature | How | What You'll See |
|---------|-----|-----------------|
| **Signup** | Signup button | New account created ✅ |
| **Login** | Your email/password | Logged in (token saved) ✅ |
| **Browse** | Home page | Restaurant list (mock data) ✅ |
| **Add to Cart** | Click restaurant → Add item | Item appears in cart ✅ |
| **Checkout** | Cart → Proceed | Checkout form appears ✅ |
| **Payment** | Fill mock card info | Payment success page ✅ |
| **Profile** | Click profile icon | View/edit profile ✅ |
| **Orders** | Orders menu | See order history ✅ |

### 🚗 Test Driver Dashboard
1. **Signup as driver** (select "driver" role in signup)
2. Go to `/driver-dashboard`
3. See available orders (from mock data)
4. Click "Accept Order"
5. View active delivery with mock GPS tracking

### 🏪 Test Restaurant Dashboard
1. **Signup as restaurant** (select "restaurant" role)
2. Go to `/restaurant-dashboard`
3. See restaurant orders & analytics
4. Manage menu items (add/edit/delete)
5. View restaurant statistics

---

## 🐛 Troubleshooting

### ❌ "Port 5000 already in use"
```bash
# Change port in backend/.env:
PORT=5001
```

### ❌ "npm: command not found"
```bash
# Node.js not installed correctly
# Download and reinstall from https://nodejs.org
```

### ❌ "Frontend won't load (blank page)"
```bash
# Clear browser cache:
# Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)
# Or open in Incognito/Private window
```

### ❌ "Backend crashes on startup"
```bash
# Clear node_modules and reinstall:
cd backend
rm -r node_modules
npm install
npm start
```

---

## 📁 File Locations

Important files to know about:

| File | Location | Purpose |
|------|----------|---------|
| **Backend Config** | `backend/.env` | Database, JWT secret, port |
| **Frontend Config** | `frontend/.env` | API URL, etc |
| **Backend Server** | `backend/src/server.js` | Main entry point |
| **Frontend Root** | `frontend/src/App.jsx` | Main React component |
| **Database** | Local MongoDB or Atlas | Data storage |

---

## 🎓 Next Steps

After initial setup:

1. **Explore the Code**
   - Check `frontend/src/pages/` for page components
   - Check `backend/src/controllers/` for API logic

2. **Read Documentation**
   - [DEPLOYMENT.md](./DEPLOYMENT.md) - Full setup guide
   - [PROGRESS.md](./PROGRESS.md) - Detailed progress
   - [PHASE_4_5_6_SUMMARY.md](./PHASE_4_5_6_SUMMARY.md) - Features

3. **Setup Real Database**
   - Use MongoDB Atlas (cloud) or MongoDB Local

4. **Customize Data**
   - Modify hardcoded restaurant/menu data
   - Add real images
   - Connect to real database

---

## ✅ Success Checklist

- [ ] Terminal 1 shows "Server running on port 5000"
- [ ] Terminal 2 shows "Compiled successfully"
- [ ] Browser opens to http://localhost:3000
- [ ] You can signup & login
- [ ] You can see restaurant list
- [ ] You can add items to cart
- [ ] You can proceed to checkout
- [ ] You can complete order

If ALL ✅ you're done! 🎉

---

## 💡 Pro Tips

1. **Keep terminals open** - Both backend & frontend need to run
2. **Use different browsers** - Test multiple user accounts simultaneously
3. **Check browser console** - See any errors (F12 → Console)
4. **Check terminal output** - Backend logs show API calls
5. **Use Incognito Mode** - Avoid caching issues

---

## 🚀 When Ready for Production

When you want to deploy for real:
1. Read [DEPLOYMENT.md](./DEPLOYMENT.md)
2. Setup MongoDB Atlas
3. Deploy backend to Heroku/Railway
4. Deploy frontend to Vercel/Netlify
5. Connect frontend to production backend URL

---

**🎉 That's it! You're running a full-stack food delivery app!**

Questions? Check [README.md](./README.md) for more info.

Need help? Open an issue or check docs in project root.

**Enjoy! 🚀**
