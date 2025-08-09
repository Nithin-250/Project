# TrustLens Fraud Detection System - Deployment Guide

## 🚀 Complete Deployment Solution

This guide provides step-by-step instructions to deploy your TrustLens fraud detection system on **Render** (backend) and **Vercel** (frontend).

## 🏗️ Architecture Overview

```
Frontend (Vercel)     →     Backend (Render)     →     MongoDB Atlas
    ↓                          ↓                          ↓
- index.html           - Express.js API         - Transaction Data
- fraudcheck.html      - Fraud Detection Logic  - Blacklist Data  
- analytics.html       - MongoDB Integration    - Analytics Data
- dashboard.html       - Twilio SMS Integration
```

## 📋 Prerequisites

- [Git](https://git-scm.com/) installed
- [Node.js](https://nodejs.org/) 18+ installed
- GitHub account
- Vercel account (free)
- Render account (free)
- MongoDB Atlas account (free)

## 🗄️ Step 1: Set Up MongoDB Atlas

1. **Create MongoDB Atlas Account**
   - Go to [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account
   - Create a new cluster (choose AWS M0 free tier)

2. **Configure Database**
   - Create database: `fraud_detection`
   - Create collections: `transactions`, `blacklist`
   - Create a database user with read/write permissions

3. **Get Connection String**
   ```
   mongodb+srv://<username>:<password>@cluster0.mongodb.net/fraud_detection?retryWrites=true&w=majority
   ```

## 🔧 Step 2: Prepare Your Code

1. **Clone/Setup Repository**
   ```bash
   git clone <your-repo-url>
   cd codezilla-patch-2
   ```

2. **Update Environment Variables in API/.env**
   ```env
   MONGO_URI=mongodb+srv://trustlens:TrustLens2024@cluster0.mongodb.net/fraud_detection?retryWrites=true&w=majority
   MONGO_DB_NAME=fraud_detection
   MONGO_COLLECTION_NAME=transactions
   PORT=10000
   TWILIO_ACCOUNT_SID=your_twilio_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_NUMBER=your_twilio_phone_number
   NODE_ENV=production
   ```

## 🚀 Step 3: Deploy Backend to Render

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy on Render**
   - Go to [render.com](https://render.com) and sign up
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `trustlens-fraud-api`
     - **Root Directory**: `API`
     - **Environment**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Instance Type**: Free

3. **Add Environment Variables on Render**
   ```
   MONGO_URI=mongodb+srv://trustlens:TrustLens2024@cluster0.mongodb.net/fraud_detection?retryWrites=true&w=majority
   MONGO_DB_NAME=fraud_detection
   MONGO_COLLECTION_NAME=transactions
   PORT=10000
   NODE_ENV=production
   TWILIO_ACCOUNT_SID=your_twilio_sid
   TWILIO_AUTH_TOKEN=your_twilio_token
   TWILIO_NUMBER=your_twilio_number
   ```

4. **Deploy and Test**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Test your API: `https://trustlens-fraud-api.onrender.com/health`

## 🌐 Step 4: Deploy Frontend to Vercel

1. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com) and sign up with GitHub
   - Click "Import Project" → Select your repository
   - Configure:
     - **Project Name**: `trustlens-frontend`
     - **Framework Preset**: Other
     - **Root Directory**: `website`
     - **Build Command**: (leave empty)
     - **Output Directory**: (leave empty)

2. **Environment Variables on Vercel**
   ```
   API_BASE=https://trustlens-fraud-api.onrender.com
   ```

3. **Deploy**
   - Click "Deploy"
   - Wait for deployment (2-3 minutes)
   - Your site will be available at: `https://trustlens-frontend.vercel.app`

## 🔗 Step 5: Update API Endpoints

Make sure your frontend is pointing to the correct backend URL. The files should already be configured with:

```javascript
const API_BASE = window.location.hostname === 'localhost'
    ? 'http://localhost:3001'
    : 'https://trustlens-fraud-api.onrender.com';
```

## 🧪 Step 6: Test Your Deployment

### API Health Check
```bash
curl https://trustlens-fraud-api.onrender.com/health
```

### Frontend Test
1. Visit your Vercel URL
2. Navigate to FraudCheck page
3. Submit a test transaction
4. Verify data appears in Analytics dashboard

### Test Fraud Detection
1. **Safe Transaction Test:**
   - Amount: ₹5,000
   - Location: Chennai
   - Time: 2 PM

2. **Fraud Transaction Test:**
   - Amount: ₹150,000 (triggers high amount alert)
   - Location: Mumbai
   - Recipient: 9876543210 (blacklisted account)
   - Time: 2 AM (triggers odd hours alert)

## 📊 Features Included

### Frontend Pages:
- **Home** (`index.html`): Landing page with features and pricing
- **FraudCheck** (`fraudcheck.html`): Transaction submission and analysis
- **Analytics** (`analytics.html`): Real-time dashboard with charts
- **Dashboard** (`dashboard.html`): Admin panel for system management

### Backend Endpoints:
- `GET /health` - API health status
- `POST /submit` - Submit transaction for fraud analysis
- `GET /anomalous` - Check last transaction anomaly status
- `GET /data` - Retrieve all transactions
- `GET /stats` - Get fraud detection statistics
- `GET /search` - Search transactions
- `POST /analyze` - Advanced fraud analysis
- `POST /blacklist` - Manage blacklisted accounts
- `POST /send-sms` - Send SMS notifications

### Fraud Detection Features:
1. **Behavioral Anomaly Detection** - Unusual transaction amounts
2. **Geographic Drift Detection** - Location-based risk assessment
3. **Time-based Risk Analysis** - Odd hours transaction monitoring
4. **Blacklist Management** - Automatic flagging of known bad actors
5. **IP-based Risk Scoring** - Suspicious IP detection
6. **Real-time SMS Alerts** - Twilio integration for notifications

## 🛡️ Security Features

- CORS protection
- Environment variable security
- MongoDB Atlas encryption
- Input validation
- Rate limiting (can be added)
- API key authentication (prepared)

## 📈 Monitoring & Analytics

The system includes:
- Real-time transaction monitoring
- Fraud rate analytics
- Risk score distribution
- Activity feed
- System health monitoring
- Export capabilities

## 🔧 Configuration Options

### Fraud Detection Thresholds:
- **High Risk Amount**: ₹100,000+
- **Medium Risk Amount**: ₹50,000+
- **Odd Hours**: 12 AM - 4 AM
- **Geographic Distance**: 500km+ between transactions
- **Behavioral Z-Score**: 2.5+ standard deviations

### MongoDB Collections:
- `transactions` - All transaction data
- `blacklist` - Flagged accounts and IPs

## 🚨 Troubleshooting

### Common Issues:

1. **API Connection Error**
   ```
   Solution: Check Render deployment logs and environment variables
   ```

2. **MongoDB Connection Failed**
   ```
   Solution: Verify MongoDB Atlas connection string and IP whitelist
   ```

3. **CORS Issues**
   ```
   Solution: Ensure API_BASE URLs are correctly configured
   ```

4. **SMS Not Working**
   ```
   Solution: Check Twilio credentials and phone number format
   ```

## 🎯 Success Criteria

Your deployment is successful when:

✅ Backend API health check returns "healthy" status  
✅ Frontend loads without errors  
✅ Fraud detection form submits successfully  
✅ Transaction history loads properly  
✅ Analytics dashboard displays real-time data  
✅ SMS notifications work (if Twilio configured)  
✅ MongoDB stores transaction data correctly  

## 🔗 Live URLs

After deployment, you'll have:

- **Frontend**: `https://your-project-name.vercel.app`
- **Backend API**: `https://trustlens-fraud-api.onrender.com`
- **API Health**: `https://trustlens-fraud-api.onrender.com/health`

## 📞 Support

For deployment issues:
1. Check deployment logs on Render/Vercel
2. Verify environment variables
3. Test API endpoints individually
4. Check MongoDB Atlas connectivity

## 🎉 Congratulations!

Your TrustLens Fraud Detection System is now live and operational with:
- Production-ready MongoDB database
- Scalable backend API on Render
- Fast, responsive frontend on Vercel
- Real-time fraud detection capabilities
- Comprehensive analytics dashboard

The system is ready to protect against financial fraud with AI-powered detection algorithms! 🛡️💳
