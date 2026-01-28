import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5198";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("fintrack_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("fintrack_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Types
export interface Transaction {
  id: string;
  amount: number;
  type: "CREDIT" | "DEBIT" | "TRANSFER";
  status: "PENDING" | "COMPLETED" | "FAILED" | "FLAGGED";
  timestamp: string;
  accountId: string;
  merchant: string;
  location: string;
  description: string;
  category: string;
  riskScore: number;
  isFraud: boolean;
}

export interface Account {
  id: string;
  accountNumber: string;
  name: string;
  type: "CHECKING" | "SAVINGS" | "BUSINESS" | "INVESTMENT";
  balance: number;
  currency: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  createdAt: string;
  lastUpdated: string;
  userId: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN" | "ANALYST";
  status: "ACTIVE" | "INACTIVE";
  lastLogin: string;
  createdAt: string;
}

export interface FraudAlert {
  id: string;
  transactionId: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  type: string;
  description: string;
  status: "OPEN" | "INVESTIGATING" | "RESOLVED" | "FALSE_POSITIVE";
  timestamp: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface RiskScore {
  score: number;
  level: "LOW" | "MEDIUM" | "HIGH";
  factors: string[];
  lastUpdated: string;
  confidence: number;
}

export interface DashboardStats {
  totalBalance: number;
  totalTransactions: number;
  fraudDetected: number;
  riskScore: number;
  monthlyGrowth: number;
  activeAccounts: number;
  pendingTransactions: number;
  systemUptime: number;
}

export interface AnalyticsData {
  dailyVolume: Array<{ date: string; amount: number }>;
  fraudTrends: Array<{ date: string; count: number }>;
  transactionCategories: Array<{ category: string; count: number; amount: number }>;
  topMerchants: Array<{ merchant: string; count: number; amount: number }>;
}

// API Service
export const bankingApi = {
  // Auth
  auth: {
    login: (credentials: { email: string; password: string }) =>
      apiClient.post<{ token: string; user: User }>("/api/auth/login", credentials),
    
    register: (data: { email: string; password: string; name: string }) =>
      apiClient.post<{ token: string; user: User }>("/api/auth/register", data),
    
    logout: () => apiClient.post("/api/auth/logout"),
    
    me: () => apiClient.get<User>("/api/auth/me"),
    
    refreshToken: () => apiClient.post<{ token: string }>("/api/auth/refresh"),
  },

  // Accounts
  accounts: {
    getAll: (params?: { type?: string; status?: string }) =>
      apiClient.get<Account[]>("/api/accounts", { params }),
    
    getById: (id: string) => apiClient.get<Account>(`/api/accounts/${id}`),
    
    create: (data: Partial<Account>) => apiClient.post<Account>("/api/accounts", data),
    
    update: (id: string, data: Partial<Account>) =>
      apiClient.put<Account>(`/api/accounts/${id}`, data),
    
    delete: (id: string) => apiClient.delete(`/api/accounts/${id}`),
    
    getBalance: (id: string) =>
      apiClient.get<{ balance: number; available: number }>(`/api/accounts/${id}/balance`),
    
    getTransactions: (id: string, params?: { startDate?: string; endDate?: string }) =>
      apiClient.get<Transaction[]>(`/api/accounts/${id}/transactions`, { params }),
  },

  // Transactions
  transactions: {
    getAll: (params?: {
      startDate?: string;
      endDate?: string;
      type?: string;
      status?: string;
      accountId?: string;
      page?: number;
      pageSize?: number;
    }) => apiClient.get<{ data: Transaction[]; total: number; page: number }>("/api/transactions", { params }),
    
    getById: (id: string) => apiClient.get<Transaction>(`/api/transactions/${id}`),
    
    create: (data: {
      amount: number;
      type: string;
      accountId: string;
      merchant: string;
      description?: string;
    }) => apiClient.post<Transaction>("/api/transactions", data),
    
    analyze: (transactionId: string) =>
      apiClient.post<{ riskScore: number; isFraud: boolean; reasons: string[] }>(
        `/api/transactions/${transactionId}/analyze`
      ),
    
    flagAsFraud: (transactionId: string, reason: string) =>
      apiClient.post(`/api/transactions/${transactionId}/flag`, { reason }),
    
    export: (params?: any) =>
      apiClient.get("/api/transactions/export", { params, responseType: "blob" }),
  },

  // Fraud Detection
  fraud: {
    getAlerts: (params?: { status?: string; severity?: string }) =>
      apiClient.get<FraudAlert[]>("/api/fraud/alerts", { params }),
    
    getAlert: (id: string) => apiClient.get<FraudAlert>(`/api/fraud/alerts/${id}`),
    
    updateAlert: (id: string, data: { status: string; notes?: string }) =>
      apiClient.put<FraudAlert>(`/api/fraud/alerts/${id}`, data),
    
    getStats: () =>
      apiClient.get<{
        totalDetected: number;
        accuracy: number;
        falsePositives: number;
        avgResponseTime: number;
        today: number;
      }>("/api/fraud/stats"),
    
    analyzeBatch: (transactions: Transaction[]) =>
      apiClient.post<{ suspicious: number; riskScore: number }>("/api/fraud/analyze/batch", {
        transactions,
      }),
  },

  // Risk Analysis
  risk: {
    getScore: (accountId: string) =>
      apiClient.get<RiskScore>(`/api/risk/${accountId}/score`),
    
    analyzePortfolio: (accountIds: string[]) =>
      apiClient.post<{
        overallRisk: number;
        diversificationScore: number;
        recommendations: string[];
        vulnerableAccounts: string[];
      }>("/api/risk/portfolio/analyze", { accountIds }),
    
    getPredictions: (accountId: string) =>
      apiClient.get<{
        defaultProbability: number;
        fraudProbability: number;
        nextMonthRisk: number;
      }>(`/api/risk/${accountId}/predictions`),
  },

  // Analytics
  analytics: {
    getDashboardStats: () =>
      apiClient.get<DashboardStats>("/api/analytics/dashboard"),
    
    getTransactionVolume: (period: "DAY" | "WEEK" | "MONTH" | "YEAR") =>
      apiClient.get<Array<{ date: string; amount: number; count: number }>>(
        `/api/analytics/volume?period=${period}`
      ),
    
    getFraudTrends: (days: number = 30) =>
      apiClient.get<Array<{ date: string; count: number; amount: number }>>(
        `/api/analytics/fraud-trends?days=${days}`
      ),
    
    getCustomerBehavior: (userId: string) =>
      apiClient.get<{
        spendingPatterns: any[];
        frequentMerchants: string[];
        riskProfile: string;
      }>(`/api/analytics/customer/${userId}/behavior`),
  },

  // Reports
  reports: {
    generateStatement: (accountId: string, startDate: string, endDate: string) =>
      apiClient.get(`/api/reports/statement/${accountId}`, {
        params: { startDate, endDate },
        responseType: "blob",
      }),
    
    generateFraudReport: (startDate: string, endDate: string) =>
      apiClient.get("/api/reports/fraud", {
        params: { startDate, endDate },
        responseType: "blob",
      }),
    
    generateRiskReport: () =>
      apiClient.get("/api/reports/risk", { responseType: "blob" }),
  },
};

export default bankingApi;
