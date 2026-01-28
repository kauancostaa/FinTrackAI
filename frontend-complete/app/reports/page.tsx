"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  FileText,
  Download,
  Eye,
  Calendar,
  Filter,
  Printer,
  Share2,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";

const reportTemplates = [
  { id: "RPT001", name: "Relatório Diário", type: "Automático", frequency: "Diário", lastRun: "Hoje 08:00", status: "Concluído" },
  { id: "RPT002", name: "Análise Semanal", type: "Automático", frequency: "Semanal", lastRun: "14/03/2024", status: "Concluído" },
  { id: "RPT003", name: "Mensal Financeiro", type: "Automático", frequency: "Mensal", lastRun: "01/03/2024", status: "Concluído" },
  { id: "RPT004", name: "Auditoria de Fraude", type: "Manual", frequency: "Sob Demanda", lastRun: "10/03/2024", status: "Concluído" },
  { id: "RPT005", name: "Risco por Cliente", type: "Manual", frequency: "Trimestral", lastRun: "05/03/2024", status: "Pendente" },
  { id: "RPT006", name: "Conformidade Regulatória", type: "Automático", frequency: "Mensal", lastRun: "28/02/2024", status: "Concluído" },
];

const generatedReports = [
  { id: "GEN001", name: "Relatório Diário - 15/03/2024", type: "PDF", size: "2.4 MB", generated: "15/03/2024 08:05", status: "Disponível" },
  { id: "GEN002", name: "Análise Semanal - Semana 11", type: "Excel", size: "5.7 MB", generated: "14/03/2024 09:30", status: "Disponível" },
  { id: "GEN003", name: "Auditoria Q1 2024", type: "PDF", size: "8.2 MB", generated: "10/03/2024 14:15", status: "Disponível" },
  { id: "GEN004", name: "Relatório de Conformidade", type: "PDF", size: "3.1 MB", generated: "28/02/2024 11:00", status: "Disponível" },
];

export default function ReportsPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleGenerate = (templateId: string) => {
    setSelectedTemplate(templateId);
    toast.success(`Gerando relatório: ${templateId}`);
    // Simulação de geração
    setTimeout(() => {
      toast.success("Relatório gerado com sucesso!");
      setSelectedTemplate(null);
    }, 2000);
  };

  const handleDownload = (reportId: string) => {
    toast.success(`Baixando relatório: ${reportId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Concluído":
      case "Disponível":
        return "bg-green-100 text-green-800";
      case "Pendente":
        return "bg-yellow-100 text-yellow-800";
      case "Erro":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Concluído":
      case "Disponível":
        return <CheckCircle className="h-4 w-4" />;
      case "Pendente":
        return <Clock className="h-4 w-4" />;
      case "Erro":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8 text-blue-600" />
            Sistema de Relatórios
          </h1>
          <p className="text-gray-500">Gere e gerencie relatórios personalizados</p>
        </div>
        <Button>
          <Calendar className="h-4 w-4 mr-2" />
          Agendar Relatório
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Relatórios Gerados</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">248</div>
            <p className="text-xs text-gray-500">Este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Automáticos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">186</div>
            <p className="text-xs text-gray-500">75% do total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Espaço Usado</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2 GB</div>
            <p className="text-xs text-gray-500">de 10 GB disponíveis</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Templates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Templates de Relatório</span>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtrar
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportTemplates.map((template) => (
                <div key={template.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-gray-500" />
                      <span className="font-semibold">{template.name}</span>
                      <Badge variant="outline">{template.type}</Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Frequência: {template.frequency} • Última execução: {template.lastRun}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(template.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(template.status)}
                        {template.status}
                      </div>
                    </Badge>
                    <Button
                      size="sm"
                      onClick={() => handleGenerate(template.id)}
                      disabled={selectedTemplate === template.id}
                    >
                      {selectedTemplate === template.id ? "Gerando..." : "Gerar"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Relatórios Gerados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Relatórios Gerados</span>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtrar
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {generatedReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-gray-500" />
                      <span className="font-semibold">{report.name}</span>
                      <Badge variant="outline">{report.type}</Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {report.size} • Gerado em: {report.generated}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(report.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(report.status)}
                        {report.status}
                      </div>
                    </Badge>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => handleDownload(report.id)}>
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Printer className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button variant="outline" className="flex flex-col h-24 gap-2">
              <FileText className="h-6 w-6" />
              <span>Relatório Personalizado</span>
            </Button>
            <Button variant="outline" className="flex flex-col h-24 gap-2">
              <Calendar className="h-6 w-6" />
              <span>Agendar Todos</span>
            </Button>
            <Button variant="outline" className="flex flex-col h-24 gap-2">
              <Download className="h-6 w-6" />
              <span>Exportar Tudo</span>
            </Button>
            <Button variant="outline" className="flex flex-col h-24 gap-2">
              <Printer className="h-6 w-6" />
              <span>Impressão em Lote</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
