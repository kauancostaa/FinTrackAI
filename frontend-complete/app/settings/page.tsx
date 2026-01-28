"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  Settings,
  Save,
  User,
  Shield,
  Bell,
  Globe,
  Database,
  Key,
  Users,
  RefreshCw
} from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // Geral
    companyName: "FinTrack Ltda",
    timezone: "America/Sao_Paulo",
    language: "pt-BR",
    currency: "BRL",
    
    // Segurança
    twoFactorAuth: true,
    sessionTimeout: 30,
    passwordComplexity: true,
    ipWhitelist: ["192.168.1.1", "10.0.0.1"],
    
    // Notificações
    emailNotifications: true,
    pushNotifications: true,
    dailyReports: true,
    alertThreshold: "medium",
    
    // Sistema
    autoBackup: true,
    backupFrequency: "daily",
    retentionPeriod: 90,
    apiRateLimit: 1000,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Simulação de salvamento
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Configurações salvas com sucesso!");
    }, 1500);
  };

  const handleReset = () => {
    toast.success("Configurações resetadas para padrão");
  };

  const handleTestEmail = () => {
    toast.success("Email de teste enviado!");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="h-8 w-8 text-blue-600" />
            Configurações do Sistema
          </h1>
          <p className="text-gray-500">Configure todas as opções do sistema</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Resetar
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>
      </div>

      {/* Configurações Gerais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Configurações Gerais
          </CardTitle>
          <CardDescription>Configurações básicas do sistema</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Nome da Empresa</label>
              <Input
                value={settings.companyName}
                onChange={(e) => setSettings({...settings, companyName: e.target.value})}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Fuso Horário</label>
              <Select value={settings.timezone} onValueChange={(value) => setSettings({...settings, timezone: value})}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/Sao_Paulo">Brasília (GMT-3)</SelectItem>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="America/New_York">New York (GMT-5)</SelectItem>
                  <SelectItem value="Europe/London">London (GMT+0)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Idioma</label>
              <Select value={settings.language} onValueChange={(value) => setSettings({...settings, language: value})}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="es-ES">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Moeda</label>
              <Select value={settings.currency} onValueChange={(value) => setSettings({...settings, currency: value})}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BRL">Real Brasileiro (R$)</SelectItem>
                  <SelectItem value="USD">Dólar Americano ($)</SelectItem>
                  <SelectItem value="EUR">Euro (€)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Segurança */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Segurança
          </CardTitle>
          <CardDescription>Configurações de segurança e acesso</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Autenticação de Dois Fatores</p>
              <p className="text-sm text-gray-500">Exigir 2FA para todos os usuários</p>
            </div>
            <Switch
              checked={settings.twoFactorAuth}
              onCheckedChange={(checked) => setSettings({...settings, twoFactorAuth: checked})}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Complexidade de Senha</p>
              <p className="text-sm text-gray-500">Exigir senhas complexas</p>
            </div>
            <Switch
              checked={settings.passwordComplexity}
              onCheckedChange={(checked) => setSettings({...settings, passwordComplexity: checked})}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Timeout de Sessão (minutos)</label>
            <Input
              type="number"
              value={settings.sessionTimeout}
              onChange={(e) => setSettings({...settings, sessionTimeout: parseInt(e.target.value)})}
              className="mt-1 max-w-xs"
            />
          </div>
        </CardContent>
      </Card>

      {/* Notificações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificações
          </CardTitle>
          <CardDescription>Configurações de notificações do sistema</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Notificações por Email</p>
              <p className="text-sm text-gray-500">Enviar alertas por email</p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Notificações Push</p>
              <p className="text-sm text-gray-500">Notificações em tempo real</p>
            </div>
            <Switch
              checked={settings.pushNotifications}
              onCheckedChange={(checked) => setSettings({...settings, pushNotifications: checked})}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Relatórios Diários</p>
              <p className="text-sm text-gray-500">Enviar relatório diário automaticamente</p>
            </div>
            <Switch
              checked={settings.dailyReports}
              onCheckedChange={(checked) => setSettings({...settings, dailyReports: checked})}
            />
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleTestEmail}>
              Testar Email
            </Button>
            <Button variant="outline">
              Configurar SMTP
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Sistema
          </CardTitle>
          <CardDescription>Configurações avançadas do sistema</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Backup Automático</p>
              <p className="text-sm text-gray-500">Realizar backups automaticamente</p>
            </div>
            <Switch
              checked={settings.autoBackup}
              onCheckedChange={(checked) => setSettings({...settings, autoBackup: checked})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Frequência de Backup</label>
              <Select value={settings.backupFrequency} onValueChange={(value) => setSettings({...settings, backupFrequency: value})}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">A cada hora</SelectItem>
                  <SelectItem value="daily">Diariamente</SelectItem>
                  <SelectItem value="weekly">Semanalmente</SelectItem>
                  <SelectItem value="monthly">Mensalmente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Período de Retenção (dias)</label>
              <Input
                type="number"
                value={settings.retentionPeriod}
                onChange={(e) => setSettings({...settings, retentionPeriod: parseInt(e.target.value)})}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Limite de API (requests/hora)</label>
            <Input
              type="number"
              value={settings.apiRateLimit}
              onChange={(e) => setSettings({...settings, apiRateLimit: parseInt(e.target.value)})}
              className="mt-1 max-w-xs"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
