"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  AlertTriangle,
  Shield,
  Activity,
  Filter,
  Download,
  RefreshCw,
  Settings,
  Eye,
  CheckCircle,
  XCircle
} from "lucide-react";

const mockFraudAlerts = [
  { id: "FRAUD001", type: "Transação Suspeita", severity: "Alta", status: "Ativo", confidence: 92, date: "15/03/2024 10:30", account: "ACC001" },
  { id: "FRAUD002", type: "Login Anômalo", severity: "Média", status: "Investigando", confidence: 75, date: "15/03/2024 09:15", account: "ACC002" },
  { id: "FRAUD003", type: "Padrão Incomum", severity: "Crítica", status: "Ativo", confidence: 98, date: "14/03/2024 14:45", account: "ACC003" },
  { id: "FRAUD004", type: "Localização Suspeita", severity: "Baixa", status: "Resolvido", confidence: 45, date: "14/03/2024 11:20", account: "ACC004" },
  { id: "FRAUD005", type: "Valor Atípico", severity: "Alta", status: "Ativo", confidence: 88, date: "13/03/2024 16:30", account: "ACC005" },
];

const aiModels = [
  { id: "model1", name: "Detector de Anomalias", enabled: true, accuracy: 94.5 },
  { id: "model2", name: "Análise de Comportamento", enabled: true, accuracy: 89.2 },
  { id: "model3", name: "Reconhecimento de Padrões", enabled: false, accuracy: 96.7 },
  { id: "model4", name: "Detecção em Tempo Real", enabled: true, accuracy: 91.8 },
];

export default function FraudDetectionPage() {
  const [alerts] = useState(mockFraudAlerts);
  const [models, setModels] = useState(aiModels);
  const [autoBlock, setAutoBlock] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);

  const toggleModel = (id: string) => {
    setModels(models.map(model => 
      model.id === id ? { ...model, enabled: !model.enabled } : model
    ));
    toast.success("Modelo atualizado");
  };

  const handleResolve = (id: string) => {
    toast.success(`Alerta ${id} resolvido`);
  };

  const handleFalsePositive = (id: string) => {
    toast.warning(`Marcado como falso positivo: ${id}`);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Crítica": return "bg-red-100 text-red-800";
      case "Alta": return "bg-orange-100 text-orange-800";
      case "Média": return "bg-yellow-100 text-yellow-800";
      case "Baixa": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativo": return "bg-red-100 text-red-800";
      case "Investigando": return "bg-yellow-100 text-yellow-800";
      case "Resolvido": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-600" />
            Detecção de Fraude
          </h1>
          <p className="text-gray-500">Sistema inteligente de prevenção e detecção de fraudes</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtrar
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button>
            <Settings className="h-4 w-4 mr-2" />
            Configurar
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas Ativos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">3</div>
            <p className="text-xs text-gray-500">Requerem atenção imediata</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Precisão do Sistema</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.5%</div>
            <p className="text-xs text-gray-500">Taxa de acerto</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fraudes Prevenidas</CardTitle>
            <Shield className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-gray-500">Este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio Resposta</CardTitle>
            <RefreshCw className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3min</div>
            <p className="text-xs text-gray-500">Para análise</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alertas */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Alertas de Fraude Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${getSeverityColor(alert.severity).split(' ')[0]}`}>
                      <AlertTriangle className={`h-5 w-5 ${getSeverityColor(alert.severity).split(' ')[1]}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{alert.type}</span>
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                        <Badge className={getStatusColor(alert.status)}>
                          {alert.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">
                        Conta: {alert.account} • {alert.date} • Confiança: {alert.confidence}%
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleResolve(alert.id)}>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Resolver
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleFalsePositive(alert.id)}>
                      <XCircle className="h-4 w-4 mr-1" />
                      Falso Positivo
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Configurações */}
        <Card>
          <CardHeader>
            <CardTitle>Configurações do Sistema</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium">Modelos de IA</h3>
              {models.map((model) => (
                <div key={model.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{model.name}</p>
                    <p className="text-sm text-gray-500">Precisão: {model.accuracy}%</p>
                  </div>
                  <Switch
                    checked={model.enabled}
                    onCheckedChange={() => toggleModel(model.id)}
                  />
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Bloqueio Automático</p>
                  <p className="text-sm text-gray-500">Bloquear transações suspeitas automaticamente</p>
                </div>
                <Switch
                  checked={autoBlock}
                  onCheckedChange={setAutoBlock}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Alertas por Email</p>
                  <p className="text-sm text-gray-500">Enviar notificações por email</p>
                </div>
                <Switch
                  checked={emailAlerts}
                  onCheckedChange={setEmailAlerts}
                />
              </div>
            </div>

            <Button className="w-full" variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Ver Logs do Sistema
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
