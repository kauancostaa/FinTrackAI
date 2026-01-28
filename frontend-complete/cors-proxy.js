// proxy-server.js - Proxy para resolver CORS
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 8080;

// Permitir todas as origens
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true
}));

app.use(express.json());

// Rota de health
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'CORS Proxy', port: PORT });
});

// Proxy para AccountService (porta 5198)
app.all('/account/*', async (req, res) => {
  try {
    const url = `http://localhost:5198${req.url.replace('/account', '')}`;
    console.log(`📡 Proxying to AccountService: ${url}`);
    
    const config = {
      method: req.method,
      url: url,
      headers: req.headers,
      data: req.body,
      params: req.query
    };
    
    const response = await axios(config);
    res.json(response.data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(error.response?.status || 500).json({ 
      error: error.message,
      usingMock: true,
      mockData: getMockData(req.url)
    });
  }
});

// Proxy genérico para qualquer serviço
app.all('/api/*', async (req, res) => {
  try {
    const targetUrl = `http://localhost:5198${req.url}`;
    console.log(`📡 Proxying to: ${targetUrl}`);
    
    const config = {
      method: req.method,
      url: targetUrl,
      headers: req.headers,
      data: req.body,
      params: req.query
    };
    
    delete config.headers.host; // Remove host header
    
    const response = await axios(config);
    res.json(response.data);
  } catch (error) {
    console.log(`⚠️ Service unavailable, returning mock data for: ${req.url}`);
    
    // Retornar dados mock
    const mockData = getMockData(req.url);
    res.json(mockData);
  }
});

// Função para gerar dados mock
function getMockData(url) {
  if (url.includes('/dashboard/stats')) {
    return {
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
    };
  }
  
  if (url.includes('/transactions')) {
    return {
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
    };
  }
  
  if (url.includes('/fraud/alerts')) {
    return [
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
    ];
  }
  
  return { message: 'Mock data', url, timestamp: new Date().toISOString() };
}

app.listen(PORT, () => {
  console.log(`🚀 CORS Proxy Server running on http://localhost:${PORT}`);
  console.log(`🔗 AccountService: http://localhost:${PORT}/api/dashboard/stats`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
