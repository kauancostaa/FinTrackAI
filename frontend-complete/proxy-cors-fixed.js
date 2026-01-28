// proxy-server-fixed.js - Proxy CORS corrigido
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 8080;

// Permitir todas as origens - CORS completo
app.use(cors({
  origin: true, // Permitir qualquer origem
  credentials: true
}));

app.use(express.json());

// Rota de health
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'CORS Proxy', 
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// Proxy para AccountService - ROTA CORRIGIDA (sem *)
app.use('/account', async (req, res) => {
  try {
    const targetUrl = `http://localhost:5198${req.url}`;
    console.log(`📡 Proxying to AccountService: ${targetUrl}`);
    
    const config = {
      method: req.method,
      url: targetUrl,
      headers: { ...req.headers, host: 'localhost:5198' },
      data: req.body,
      params: req.query
    };
    
    // Remove headers problemáticos
    delete config.headers['content-length'];
    
    const response = await axios(config);
    res.json(response.data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    
    // Retornar mock data em caso de erro
    res.json(getMockData(req.url));
  }
});

// Proxy para todas as outras rotas API
app.use('/api', async (req, res) => {
  try {
    const servicePorts = {
      'dashboard': 5198,
      'transactions': 5001,
      'fraud': 5002,
      'identity': 5003,
      'risk': 5004,
      'accounts': 5198
    };
    
    // Determinar qual serviço baseado na URL
    let targetPort = 5198; // Default para AccountService
    
    for (const [service, port] of Object.entries(servicePorts)) {
      if (req.url.includes(service)) {
        targetPort = port;
        break;
      }
    }
    
    const targetUrl = `http://localhost:${targetPort}${req.url}`;
    console.log(`📡 Proxying to localhost:${targetPort}${req.url}`);
    
    const response = await axios({
      method: req.method,
      url: targetUrl,
      headers: req.headers,
      data: req.body,
      params: req.query,
      timeout: 5000
    });
    
    res.json(response.data);
  } catch (error) {
    console.log(`⚠️ Service error: ${error.message}`);
    res.json(getMockData(req.url));
  }
});

// Rota catch-all para qualquer outra requisição
app.all('*', async (req, res) => {
  console.log(`🌐 Catch-all route: ${req.method} ${req.url}`);
  
  // Tenta direcionar para AccountService por padrão
  try {
    const targetUrl = `http://localhost:5198${req.url}`;
    const response = await axios({
      method: req.method,
      url: targetUrl,
      headers: req.headers,
      data: req.body,
      params: req.query,
      timeout: 3000
    });
    
    res.json(response.data);
  } catch (error) {
    res.json({
      message: 'CORS Proxy - Use /api or /account routes',
      availableRoutes: ['/health', '/api/*', '/account/*'],
      request: { method: req.method, url: req.url },
      timestamp: new Date().toISOString()
    });
  }
});

// Função para gerar dados mock
function getMockData(url) {
  console.log(`🔄 Returning mock data for: ${url}`);
  
  if (url.includes('/dashboard/stats') || url.includes('/stats')) {
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
  
  return { 
    message: 'Mock data', 
    url, 
    timestamp: new Date().toISOString(),
    note: 'Real service is unavailable'
  };
}

app.listen(PORT, () => {
  console.log(`🚀 CORS Proxy Server running on http://localhost:${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/health`);
  console.log(`📊 Dashboard via proxy: http://localhost:${PORT}/api/dashboard/stats`);
  console.log(`🔗 AccountService direct: http://localhost:5198/api/dashboard/stats`);
});
