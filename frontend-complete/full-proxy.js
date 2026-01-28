// full-proxy.js - Proxy para TODOS os serviços
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 8080;

// CORS completo
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

app.use(express.json());

// Mapeamento de serviços
const SERVICES = {
  'dashboard': { port: 5198, name: 'AccountService' },
  'accounts': { port: 5198, name: 'AccountService' },
  'transactions': { port: 5001, name: 'TransactionService' },
  'fraud': { port: 5002, name: 'FraudDetectionService' },
  'identity': { port: 5003, name: 'IdentityService' },
  'risk': { port: 5004, name: 'RiskAnalysisService' },
  'notifications': { port: 5005, name: 'NotificationService' },
  'reporting': { port: 5006, name: 'ReportingService' }
};

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    proxy: 'full-service-proxy',
    port: PORT,
    services: Object.values(SERVICES).map(s => s.name),
    timestamp: new Date().toISOString()
  });
});

// Proxy inteligente
app.all('/api/:service/*', async (req, res) => {
  const serviceKey = req.params.service;
  const service = SERVICES[serviceKey];
  
  if (!service) {
    return res.status(404).json({
      error: `Service ${serviceKey} not found`,
      available: Object.keys(SERVICES)
    });
  }
  
  const targetUrl = `http://localhost:${service.port}${req.url}`;
  console.log(`📡 ${req.method} ${req.url} → ${service.name}:${service.port}`);
  
  try {
    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      params: req.query,
      headers: req.headers,
      timeout: 5000
    });
    
    res.json(response.data);
  } catch (error) {
    console.log(`❌ ${service.name} error:`, error.message);
    
    // Retorna mock data baseado no serviço
    res.json(generateMockData(serviceKey, req.url));
  }
});

// Mock data generator
function generateMockData(service, endpoint) {
  const mockGenerators = {
    dashboard: () => ({
      totalTransactions: 15876,
      fraudDetected: 24,
      riskScore: 79,
      revenue: 3287500,
      activeUsers: 1924,
      pendingAlerts: 7,
      totalAccounts: 978,
      avgTransactionValue: 1423,
      source: 'mock-data',
      service: 'AccountService (mock)'
    }),
    
    transactions: () => ({
      data: [
        {
          id: "TXN001",
          amount: 1250.50,
          type: "debit",
          status: "completed",
          merchant: "Tech Corp Inc",
          date: new Date().toISOString(),
          accountId: "ACC001",
          location: "San Francisco, CA",
          riskLevel: "low",
          category: "Technology",
          isFraud: false
        }
      ],
      total: 15876,
      page: 1,
      limit: 20,
      source: 'mock-data'
    }),
    
    fraud: () => [
      {
        id: "ALERT001",
        transactionId: "TXN003",
        severity: "high",
        description: "Suspicious large transfer",
        detectedAt: new Date().toISOString(),
        status: "open",
        confidence: 85,
        source: 'mock-data'
      }
    ],
    
    identity: () => [
      {
        id: "USR001",
        name: "Admin User",
        email: "admin@fintrackai.com",
        role: "admin",
        status: "active",
        source: 'mock-data'
      }
    ]
  };
  
  const generator = mockGenerators[service] || (() => ({
    message: `Mock data for ${service}`,
    endpoint,
    timestamp: new Date().toISOString()
  }));
  
  return generator();
}

app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════╗
  ║     🚀 FULL SERVICE PROXY ACTIVE        ║
  ║     📍 Port: ${PORT}                          ║
  ╚══════════════════════════════════════════╝
  
  📊 Services Configuration:
  ${Object.entries(SERVICES).map(([key, s]) => 
    `  • ${key.padEnd(15)} → ${s.name.padEnd(25)} :${s.port}`
  ).join('\n')}
  
  🔗 Test Endpoints:
  • http://localhost:${PORT}/health
  • http://localhost:${PORT}/api/dashboard/stats
  • http://localhost:${PORT}/api/transactions
  • http://localhost:${PORT}/api/fraud/alerts
  
  ⚡ Status: ${Object.keys(SERVICES).length} services configured
  `);
});
