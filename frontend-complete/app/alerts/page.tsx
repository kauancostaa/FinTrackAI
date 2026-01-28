"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Bell,
  BellOff,
  Mail,
  MessageSquare,
  Phone,
  Settings,
  Filter,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";

const alertTypes = [
  { id: "email", name: "Email", enabled: true, description: "Notificações por email" },
  { id: "push", name: "Push", enabled: true, description: "Notificações no navegador" },
  { id: "sms", name: "SMS", enabled: false, description: "Mensagens de texto" },
  { id: "webhook", name: "Webhook", enabled: true, description: "Integrações externas" },
];

const alertRules = [
  { id: "rule1", name: "Transação Grande", condition: "Valor > R$ 10.000", active: true, priority: "Alta" },
  { id: "rule2", name: "Múltiplas Transações", condition: ">5 transações em 1h", active: true, priority: "Média" },
  { id: "rule3", name: "Login Suspeito", condition: "IP diferente", active: false, priority: "Alta" },
  { id: "rule4", name: "Horário Atípico", condition: "Transação 00:00-06:00", active: true, priority: "Baixa" },
];

const recentAlerts = [
  { id: "alert1", type: "Transação Grande", message: "Transação de R$ 15.000 detectada", time: "2 min atrás", read: false },
  { id: "alert2", type: "Login Suspeito", message: "Login de novo dispositivo", time: "15 min atrás", read: true },
  { id: "alert3", type: "Múltiplas Transações", message: "7 transações em 45 minutos", time: "1 hora atrás", read: true },
  { id: "alert4", type: "Horário Atípico", message: "Transação às 03:30", time: "3 horas atrás", read: true },
];

export default function AlertsPage() {
  const [notificationTypes, setNotificationTypes] = useState(alertTypes);
  const [rules, setRules] = useState(alertRules);
  const [alerts, setAlerts] = useState(recentAlerts);

  const toggleNotification = (id: string) => {
    setNotificationTypes(types =>
      types.map(type =>
        type.id === id ? { ...type, enabled: !type.enabled } : type
      )
    );
    toast.success("Configuração atualizada");
  };

  const toggleRule = (id: string) => {
    setRules(rules =>
      rules.map(rule =>
        rule.id === id ? { ...rule, active: !rule.active } : rule
      )
    );
    toast.success("Regra atualizada");
  };

  const markAllAsRead = () => {
    setAlerts(alerts.map(alert => ({ ...alert, read: true })));
    toast.success("Todos alertas marcados como lidos");
  };

  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
    toast.success("Alerta removido");
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Alta": return "bg-red-100 text-red-800";
      case "Média": return "bg-yellow-100 text-yellow-800";
      case "Baixa": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bell className="h-8 w-8 text-blue-600" />
            Sistema de Alertas
          </h1>
          <p className="text-gray-500">Configure e gerencie notificações do sistema</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={markAllAsRead}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Marcar Tudo como Lido
          </Button>
          <Button>
            <Settings className="h-4 w-4 mr-2" />
            Configurações
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas Hoje</CardTitle>
            <Bell className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-gray-500">+2 desde ontem</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Não Lidos</CardTitle>
            <BellOff className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-gray-500">Requer atenção</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Regras Ativas</CardTitle>
            <Settings className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-gray-500">de 4 regras</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Resposta</CardTitle>
            <Clock className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45s</div>
            <p className="text-xs text-gray-500">Média de resposta</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configurações de Notificação */}
        <Card>
          <CardHeader>
            <CardTitle>Tipos de Notificação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {notificationTypes.map((type) => (
              <div key={type.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${type.enabled ? "bg-blue-100" : "bg-gray-100"}`}>
                    {type.id === "email" && <Mail className={`h-5 w-5 ${type.enabled ? "text-blue-600" : "text-gray-400"}`} />}
                    {type.id === "push" && <Bell className={`h-5 w-5 ${type.enabled ? "text-blue-600" : "text-gray-400"}`} />}
                    {type.id === "sms" && <MessageSquare className={`h-5 w-5 ${type.enabled ? "text-blue-600" : "text-gray-400"}`} />}
                    {type.id === "webhook" && <Settings className={`h-5 w-5 ${type.enabled ? "text-blue-600" : "text-gray-400"}`} />}
                  </div>
                  <div>
                    <p className="font-medium">{type.name}</p>
                    <p className="text-sm text-gray-500">{type.description}</p>
                  </div>
                </div>
                <Switch
                  checked={type.enabled}
                  onCheckedChange={() => toggleNotification(type.id)}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Regras de Alerta */}
        <Card>
          <CardHeader>
            <CardTitle>Regras de Alerta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {rules.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{rule.name}</span>
                    <Badge className={getPriorityColor(rule.priority)}>
                      {rule.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">{rule.condition}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={rule.active ? "default" : "outline"}>
                    {rule.active ? "Ativo" : "Inativo"}
                  </Badge>
                  <Switch
                    checked={rule.active}
                    onCheckedChange={() => toggleRule(rule.id)}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Alertas Recentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Alertas Recentes</span>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtrar
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${alert.read ? "bg-gray-100" : "bg-blue-100"}`}>
                    <Bell className={`h-5 w-5 ${alert.read ? "text-gray-400" : "text-blue-600"}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{alert.type}</span>
                      {!alert.read && (
                        <Badge className="bg-blue-100 text-blue-800">Novo</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{alert.message}</p>
                    <p className="text-xs text-gray-400">{alert.time}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteAlert(alert.id)}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
