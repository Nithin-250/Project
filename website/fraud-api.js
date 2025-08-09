const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like curl or Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],  // methods you support
  allowedHeaders: ['Content-Type', 'Authorization'],  // adjust if you need other headers
  credentials: false  // set to true if you use cookies or HTTP auth
}));

app.use(express.static('public'));

// In-memory data storage (replace with database in production)
let transactions = [];
let inMemoryBlacklist = new Set(['9876543210', '1111111111', '0000000000']);
const BLACKLISTED_IPS = new Set(['192.168.1.100', '10.0.0.50']);

// Location coordinates for geographic analysis
const locationLookup = {
    'Chennai': { lat: 13.0827, lng: 80.2707 },
    'Mumbai': { lat: 19.0760, lng: 72.8777 },
    'Delhi': { lat: 28.7041, lng: 77.1025 },
    'Bangalore': { lat: 12.9716, lng: 77.5946 },
    'Kolkata': { lat: 22.5726, lng: 88.3639 },
    'Hyderabad': { lat: 17.3850, lng: 78.4867 },
    'Pune': { lat: 18.5204, lng: 73.8567 }
};

// Helper function to calculate distance between two coordinates
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Fraud detection logic
function detectFraud(transaction) {
    const fraudReasons = [];
    
    // 1. Check blacklisted accounts
    if (inMemoryBlacklist.has(transaction.recipient_account_number) || 
        inMemoryBlacklist.has(transaction.sender_account_number)) {
        fraudReasons.push('Blacklisted account detected');
    }
    
    // 2. Check for suspicious amounts (very high amounts)
    if (transaction.amount > 100000) {
        fraudReasons.push('Unusually high transaction amount');
    }
    
    // 3. Check for odd hours (12 AM to 4 AM IST)
    const currentHour = new Date().getHours();
    if (currentHour >= 0 && currentHour <= 4) {
        fraudReasons.push('Transaction during suspicious hours (12 AM - 4 AM)');
    }
    
    // 4. Geographic impossibility check
    const userTransactions = transactions.filter(t => 
        t.sender_account_number === transaction.sender_account_number &&
        t.timestamp > Date.now() - (2 * 60 * 60 * 1000) // Last 2 hours
    );
    
    if (userTransactions.length > 0) {
        const lastTransaction = userTransactions[userTransactions.length - 1];
        const lastLocation = locationLookup[lastTransaction.location];
        const currentLocation = locationLookup[transaction.location];
        
        if (lastLocation && currentLocation) {
            const distance = calculateDistance(
                lastLocation.lat, lastLocation.lng,
                currentLocation.lat, currentLocation.lng
            );
            const timeDiff = (Date.now() - lastTransaction.timestamp) / (1000 * 60 * 60); // hours
            const maxPossibleSpeed = 500; // km/h (roughly airplane speed)
            
            if (distance > maxPossibleSpeed * timeDiff) {
                fraudReasons.push('Geographically impossible travel detected');
            }
        }
    }
    
    // 5. Behavioral analysis - check for unusual patterns
    const userAmounts = transactions
        .filter(t => t.sender_account_number === transaction.sender_account_number)
        .map(t => t.amount);
    
    if (userAmounts.length >= 3) {
        const mean = userAmounts.reduce((a, b) => a + b, 0) / userAmounts.length;
        const variance = userAmounts.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / userAmounts.length;
        const stdDev = Math.sqrt(variance);
        const zScore = Math.abs((transaction.amount - mean) / stdDev);
        
        if (zScore > 2.5) {
            fraudReasons.push('Unusual spending pattern detected');
        }
    }
    
    // 6. Check for rapid consecutive transactions
    const recentTransactions = transactions.filter(t =>
        t.sender_account_number === transaction.sender_account_number &&
        t.timestamp > Date.now() - (5 * 60 * 1000) // Last 5 minutes
    );
    
    if (recentTransactions.length >= 3) {
        fraudReasons.push('Multiple rapid transactions detected');
    }
    
    return fraudReasons;
}

// API Routes

// Submit transaction for fraud analysis
app.post('/submit', (req, res) => {
    try {
        const transaction = {
            ...req.body,
            timestamp: Date.now(),
            ip_address: req.ip || '127.0.0.1'
        };
        
        // Validate required fields
        const requiredFields = ['amount', 'location', 'card_type', 'currency', 
                              'recipient_account_number', 'sender_account_number', 'transaction_id'];
        
        for (const field of requiredFields) {
            if (!transaction[field]) {
                return res.status(400).json({ error: `Missing required field: ${field}` });
            }
        }
        
        // Run fraud detection
        const fraudReasons = detectFraud(transaction);
        const isAnomalous = fraudReasons.length > 0;
        
        // Add fraud info to transaction
        transaction.anomalous = isAnomalous;
        transaction.fraud_reasons = fraudReasons;
        
        // Auto-blacklist accounts if fraud detected
        if (isAnomalous) {
            inMemoryBlacklist.add(transaction.recipient_account_number);
            console.log(`🚨 FRAUD DETECTED: Auto-blacklisted account ${transaction.recipient_account_number}`);
        }
        
        // Store transaction
        transactions.push(transaction);
        
        // Log transaction
        console.log(`${isAnomalous ? '🚨' : '✅'} Transaction ${transaction.transaction_id}: ${isAnomalous ? 'FRAUD' : 'SAFE'}`);
        if (fraudReasons.length > 0) {
            console.log(`   Reasons: ${fraudReasons.join(', ')}`);
        }
        
        res.json({
            transaction_id: transaction.transaction_id,
            anomalous: isAnomalous,
            reasons: fraudReasons,
            timestamp: transaction.timestamp
        });
        
    } catch (error) {
        console.error('Error processing transaction:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Check if last transaction was anomalous
app.get('/anomalous', (req, res) => {
    if (transactions.length === 0) {
        return res.json(false);
    }
    
    const lastTransaction = transactions[transactions.length - 1];
    res.json(lastTransaction.anomalous || false);
});

// Get all transaction data
app.get('/data', (req, res) => {
    const sanitizedTransactions = transactions.map(t => ({
        transaction_id: t.transaction_id,
        amount: t.amount,
        location: t.location,
        currency: t.currency,
        card_type: t.card_type,
        sender_account_number: t.sender_account_number,
        recipient_account_number: t.recipient_account_number,
        anomalous: t.anomalous,
        fraud_reasons: t.fraud_reasons || [],
        timestamp: new Date(t.timestamp).toISOString()
    }));
    
    res.json(sanitizedTransactions);
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy',
        uptime: process.uptime(),
        transactions_processed: transactions.length,
        blacklisted_accounts: inMemoryBlacklist.size
    });
});

// Get blacklist status
app.get('/blacklist', (req, res) => {
    res.json({
        accounts: Array.from(inMemoryBlacklist),
        count: inMemoryBlacklist.size
    });
});

// Add account to blacklist
app.post('/blacklist', (req, res) => {
    const { account_number } = req.body;
    if (!account_number) {
        return res.status(400).json({ error: 'Account number required' });
    }
    
    inMemoryBlacklist.add(account_number);
    res.json({ 
        message: `Account ${account_number} added to blacklist`,
        total_blacklisted: inMemoryBlacklist.size
    });
});

// Remove account from blacklist
app.delete('/blacklist/:account', (req, res) => {
    const { account } = req.params;
    inMemoryBlacklist.delete(account);
    res.json({ 
        message: `Account ${account} removed from blacklist`,
        total_blacklisted: inMemoryBlacklist.size
    });
});

// Clear all data (for testing)
app.delete('/clear', (req, res) => {
    transactions = [];
    res.json({ message: 'All transaction data cleared' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 TrustLens Fraud Detection API running on http://localhost:${PORT}`);
    console.log(`🛡️  Fraud detection algorithms loaded`);
    console.log(`📊 Database: In-memory storage (${transactions.length} transactions)`);
    console.log(`🚨 Blacklisted accounts: ${inMemoryBlacklist.size}`);
    console.log(`\n📍 Supported locations: ${Object.keys(locationLookup).join(', ')}`);
    console.log(`\n🇮🇳 Ready for Indian financial fraud detection!`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down fraud detection API...');
    console.log(`📊 Final stats: ${transactions.length} transactions processed`);
    process.exit(0);
});


