"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Filter,
  Eye
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from "recharts";

const transactionData = [
  { month: "Jan", transactions: 4200, fraud: 42, revenue: 1250000 },
  { month: "Fev", transactions: 5200, fraud: 38, revenue: 1450000 },
  { month: "Mar", transactions: 6100, fraud: 35, revenue: 1680000 },
  { month: "Abr", transactions: 5800, fraud: 28, revenue: 1520000 },
  { month: "Mai", transactions: 7200, fraud: 25, revenue: 1950000 },
  { month: "Jun", transactions: 6800, fraud: 22, revenue: 1820000 },
];

const categoryData = [
  { name: "Tecnologia", value: 35, color: "#3B82F6" },
  { name: "Varejo", value: 25, color: "#10B981" },
  { name: "Serviços", value: 20, color: "#8B5CF6" },
  { name: "Educação", value: 12, color: "#F59E0B" },
  { name: "Saúde", value: 8, color: "#EF4444" },
];

const riskDistribution = [
  { level: "Baixo", count: 1560, color: "#10B981" },
  { level: "Médio", count: 320, color: "#F59E0B" },
  { level: "Alto", count: 85, color: "#EF4444" },
  { level: "Crítico", count: 12, color: "#7C3AED" },
];

export default function AnalyticsPage() {
  const handleExport = () => {
    toast.success("Exportando relatório de analytics...");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            Analytics Avançado
          </h1>
          <p className="text-gray-500">Análises detalhadas e insights de dados</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Período
          </Button>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crescimento Transacional</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+18.5%</div>
            <p className="text-xs text-gray-500">vs último mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Fraude</CardTitle>
            <BarChart3 className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0.32%</div>
            <p className="text-xs text-gray-500">-0.08% vs anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 1,250</div>
            <p className="text-xs text-gray-500">+R$ 85 vs anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retenção</CardTitle>
            <Eye className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.7%</div>
            <p className="text-xs text-gray-500">Taxa de retenção mensal</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos Principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Volume de Transações */}
        <Card>
          <CardHeader>
            <CardTitle>Volume de Transações Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={transactionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="transactions" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribuição por Categoria */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos Secundários */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Receita vs Fraude */}
        <Card>
          <CardHeader>
            <CardTitle>Receita vs Detecção de Fraude</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={transactionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Bar yAxisId="left" dataKey="revenue" name="Receita (R$)" fill="#10B981" />
                <Bar yAxisId="right" dataKey="fraud" name="Fraudes" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribuição de Risco */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Nível de Risco</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={riskDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="level" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" name="Quantidade">
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
