// simple-cors-proxy.js - Proxy CORS simples e funcional
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 8080;

// CORS completo - permitir tudo
app.use(cors());
app.use(express.json());

// 1. Rota de health
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'Simple CORS Proxy',
    port: PORT,
    time: new Date().toISOString()
  });
});

// 2. Proxy específico para dashboard
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    console.log('📊 Fetching dashboard stats...');
    const response = await axios.get('http://localhost:5198/api/dashboard/stats', {
      timeout: 3000
    });
    res.json(response.data);
  } catch (error) {
    console.log('⚠️ Using mock dashboard data');
    res.json({
      totalTransactions: 12543,
      fraudDetected: 23,
      riskScore: 78,
      revenue: 2548900,
      activeUsers: 1542,
      pendingAlerts: 8,
      totalAccounts: 892,
      avgTransactionValue: 1250,
      timestamp: new Date().toISOString(),
      source: 'mock-data'
    });
  }
});

// 3. Proxy para transactions
app.get('/api/transactions', async (req, res) => {
  try {
    console.log('💳 Fetching transactions...');
    const response = await axios.get('http://localhost:5001/api/transactions', {
      params: req.query,
      timeout: 3000
    });
    res.json(response.data);
  } catch (error) {
    console.log('⚠️ Using mock transactions');
    res.json({
      data: [
        {
          id: "TXN001",
          amount: 1250.50,
          type: "debit",
          status: "completed",
          date: "2024-03-15T10:30:00Z",
          accountId: "ACC001",
          merchant: "Tech Corp Inc",
          location: "San Francisco, CA",
          category: "Technology",
          riskLevel: "low",
          isFraud: false,
        },
        {
          id: "TXN002",
          amount: 89.99,
          type: "credit",
          status: "pending",
          date: "2024-03-15T09:15:00Z",
          accountId: "ACC002",
          merchant: "Online Retailer",
          location: "New York, NY",
          category: "Shopping",
          riskLevel: "medium",
          isFraud: false,
        },
      ],
      total: 2,
      page: 1,
      limit: 20,
      source: 'mock-data'
    });
  }
});

// 4. Proxy para fraud alerts
app.get('/api/fraud/alerts', async (req, res) => {
  try {
    console.log('🚨 Fetching fraud alerts...');
    const response = await axios.get('http://localhost:5002/api/fraud/alerts', {
      timeout: 3000
    });
    res.json(response.data);
  } catch (error) {
    console.log('⚠️ Using mock fraud alerts');
    res.json([
      {
        id: "ALERT001",
        transactionId: "TXN003",
        severity: "high",
        description: "Suspicious large transfer",
        detectedAt: "2024-03-14T14:50:00Z",
        status: "open",
        confidence: 85,
        source: 'mock-data'
      },
    ]);
  }
});

// 5. Rota para qualquer outra coisa - retorna info
app.use('/api', (req, res) => {
  res.json({
    message: 'API endpoint not specifically proxied',
    availableEndpoints: [
      '/api/dashboard/stats',
      '/api/transactions',
      '/api/fraud/alerts'
    ],
    request: {
      method: req.method,
      url: req.url,
      query: req.query
    },
    timestamp: new Date().toISOString()
  });
});

// 6. Rota catch-all SIMPLES (sem *)
app.use((req, res) => {
  if (req.url === '/') {
    res.json({
      service: 'Simple CORS Proxy',
      port: PORT,
      endpoints: [
        'GET /health',
        'GET /api/dashboard/stats',
        'GET /api/transactions',
        'GET /api/fraud/alerts'
      ],
      targetServices: [
        'AccountService: http://localhost:5198',
        'TransactionService: http://localhost:5001',
        'FraudService: http://localhost:5002'
      ]
    });
  } else {
    res.status(404).json({
      error: 'Route not found',
      requested: req.url,
      available: ['/health', '/api/dashboard/stats', '/api/transactions', '/api/fraud/alerts']
    });
  }
});

app.listen(PORT, () => {
  console.log('🚀 SIMPLE CORS Proxy Server');
  console.log(`📍 Running on: http://localhost:${PORT}`);
  console.log('📋 Available endpoints:');
  console.log('   • GET /health');
  console.log('   • GET /api/dashboard/stats → AccountService:5198');
  console.log('   • GET /api/transactions → TransactionService:5001');
  console.log('   • GET /api/fraud/alerts → FraudService:5002');
  console.log('\n🔗 Test URLs:');
  console.log(`   Proxy health: http://localhost:${PORT}/health`);
  console.log(`   Dashboard: http://localhost:${PORT}/api/dashboard/stats`);
  console.log(`   Direct AccountService: http://localhost:5198/api/dashboard/stats`);
});
