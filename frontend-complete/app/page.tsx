"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import bankingApi, { type DashboardStats, type Transaction, type FraudAlert } from "@/services/banking-api.service";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { ShieldAlert, TrendingUp, Users, DollarSign, AlertTriangle, CheckCircle } from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [alerts, setAlerts] = useState<FraudAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      console.log("Fetching dashboard data...");
      
      // Usando o novo serviço que sempre funciona
      const [statsData, transactionsData, alertsData] = await Promise.all([
        bankingApi.getDashboardStats(),
        bankingApi.getTransactions(),
        bankingApi.getFraudAlerts()
      ]);

      console.log("Data loaded successfully:", { 
        stats: !!statsData, 
        transactions: transactionsData?.data?.length || 0,
        alerts: alertsData?.length || 0 
      });

      setStats(statsData);
      // Garante que transactionsData.data existe
      setTransactions(transactionsData?.data?.slice(0, 10) || []);
      setAlerts(alertsData || []);
      
      toast.success("Dashboard atualizado com sucesso!");
    } catch (error) {
      console.error("Error in fetchDashboardData:", error);
      toast.error("Erro ao carregar dados. Usando dados de demonstração.");
      
      // Fallback hardcoded
      setStats({
        totalTransactions: 12543,
        fraudDetected: 23,
        riskScore: 78,
        revenue: 2548900,
        activeUsers: 1542,
        pendingAlerts: 8,
      });
      
      setTransactions([
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
        },
      ]);
      
      setAlerts([
        {
          id: "ALERT001",
          transactionId: "TXN003",
          severity: "high",
          description: "Suspicious large transfer",
          detectedAt: "2024-03-14T14:50:00Z",
          status: "open",
          confidence: 85,
        },
      ]);
    } finally {
      setLoading(false);
      console.log("🏁 Dashboard data fetch completed");
    }
  };

  const handleResolveAlert = (alertId: string) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
    toast.success("Alerta resolvido com sucesso!");
  };

  const filteredTransactions = transactions.filter(transaction =>
    transaction?.merchant?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction?.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Dados para gráficos - sempre disponíveis
  const transactionData = [
    { name: "Jan", transactions: 1200, fraud: 12 },
    { name: "Fev", transactions: 1900, fraud: 18 },
    { name: "Mar", transactions: 1500, fraud: 15 },
    { name: "Abr", transactions: 2100, fraud: 8 },
    { name: "Mai", transactions: 1800, fraud: 10 },
    { name: "Jun", transactions: 2200, fraud: 5 },
  ];

  const riskData = [
    { name: "Baixo", value: 65 },
    { name: "Médio", value: 25 },
    { name: "Alto", value: 10 },
  ];

  const COLORS = ["#10B981", "#F59E0B", "#EF4444"];

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard FinTrack</h1>
          <p className="text-gray-500">Monitoramento em tempo real de transações e fraudes</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchDashboardData} variant="outline">
            Atualizar Dados
          </Button>
          <Button onClick={() => toast.info("Export iniciado")}>
            Exportar Relatório
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transações Totais</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalTransactions?.toLocaleString()}</div>
            <p className="text-xs text-gray-500">+12.5% desde último mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fraudes Detectadas</CardTitle>
            <ShieldAlert className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats?.fraudDetected}</div>
            <p className="text-xs text-gray-500">-3.2% desde último mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Score de Risco</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.riskScore}/100</div>
            <p className="text-xs text-gray-500">Score geral do sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas Pendentes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pendingAlerts}</div>
            <p className="text-xs text-gray-500">Requerem atenção</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transaction Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Tendência de Transações</CardTitle>
            <CardDescription>Transações vs Fraudes (últimos 6 meses)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={transactionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="transactions" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="fraud" stroke="#EF4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Risk Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Risco</CardTitle>
            <CardDescription>Nível de risco das transações atuais</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Transactions & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Transações Recentes</CardTitle>
            <CardDescription>Últimas transações monitoradas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Input
                placeholder="Buscar transações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="space-y-3">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium">{transaction.merchant}</p>
                    <p className="text-sm text-gray-500">
                      {transaction.category} • {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </p>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      transaction.riskLevel === 'low' ? 'bg-green-100 text-green-800' :
                      transaction.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      Risco {transaction.riskLevel}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Fraud Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Alertas de Fraude</CardTitle>
            <CardDescription>Alertas ativos que requerem atenção</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-2" />
                  <p>Nenhum alerta ativo no momento</p>
                </div>
              ) : (
                alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-4 border rounded-lg space-y-2"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            alert.severity === 'critical' ? 'bg-red-100 text-red-800' :
                            alert.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                            alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {alert.severity.toUpperCase()}
                          </span>
                          <span className="text-sm text-gray-500">
                            Confiança: {alert.confidence}%
                          </span>
                        </div>
                        <p className="font-medium mt-2">{alert.description}</p>
                        <p className="text-sm text-gray-500">
                          Transação: {alert.transactionId} • {new Date(alert.detectedAt).toLocaleString()}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleResolveAlert(alert.id)}
                      >
                        Resolver
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
