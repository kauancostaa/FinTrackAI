"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Download,
  Filter,
  MoreVertical,
  Search,
  Eye,
  Edit,
  Trash2,
  RefreshCw
} from "lucide-react";

const mockTransactions = [
  { id: "TXN001", amount: 1250.50, type: "Débito", status: "Completada", merchant: "Tech Corp", date: "15/03/2024", risk: "Baixo" },
  { id: "TXN002", amount: 89.99, type: "Crédito", status: "Pendente", merchant: "Online Store", date: "15/03/2024", risk: "Médio" },
  { id: "TXN003", amount: 1500.00, type: "Transferência", status: "Completada", merchant: "Investment Bank", date: "14/03/2024", risk: "Alto" },
  { id: "TXN004", amount: 45.75, type: "Débito", status: "Completada", merchant: "Supermarket", date: "14/03/2024", risk: "Baixo" },
  { id: "TXN005", amount: 1200.00, type: "Transferência", status: "Falhou", merchant: "Utility Co", date: "13/03/2024", risk: "Crítico" },
  { id: "TXN006", amount: 299.99, type: "Crédito", status: "Completada", merchant: "Electronics", date: "13/03/2024", risk: "Baixo" },
  { id: "TXN007", amount: 850.00, type: "Débito", status: "Sinalizada", merchant: "Travel Agency", date: "12/03/2024", risk: "Alto" },
  { id: "TXN008", amount: 65.50, type: "Débito", status: "Completada", merchant: "Restaurant", date: "12/03/2024", risk: "Baixo" },
];

export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");

  const filteredTransactions = mockTransactions.filter(t => {
    const matchesSearch = 
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.merchant.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    const matchesRisk = riskFilter === "all" || t.risk === riskFilter;
    return matchesSearch && matchesStatus && matchesRisk;
  });

  const handleExport = () => {
    toast.success("Exportando transações...");
    // Lógica de exportação aqui
  };

  const handleRefresh = () => {
    toast.success("Dados atualizados");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completada": return "bg-green-100 text-green-800";
      case "Pendente": return "bg-yellow-100 text-yellow-800";
      case "Falhou": return "bg-red-100 text-red-800";
      case "Sinalizada": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Baixo": return "bg-green-100 text-green-800";
      case "Médio": return "bg-yellow-100 text-yellow-800";
      case "Alto": return "bg-orange-100 text-orange-800";
      case "Crítico": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Transações</h1>
          <p className="text-gray-500">Gerencie e monitore todas as transações</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar transações..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos Status</SelectItem>
                <SelectItem value="Completada">Completada</SelectItem>
                <SelectItem value="Pendente">Pendente</SelectItem>
                <SelectItem value="Falhou">Falhou</SelectItem>
                <SelectItem value="Sinalizada">Sinalizada</SelectItem>
              </SelectContent>
            </Select>

            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Nível de Risco" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos Risco</SelectItem>
                <SelectItem value="Baixo">Baixo</SelectItem>
                <SelectItem value="Médio">Médio</SelectItem>
                <SelectItem value="Alto">Alto</SelectItem>
                <SelectItem value="Crítico">Crítico</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Mais Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <CardTitle>Transações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Comerciante</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Risco</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{transaction.id}</TableCell>
                  <TableCell>
                    <span className={transaction.type === "Crédito" ? "text-green-600" : "text-red-600"}>
                      {transaction.type === "Crédito" ? "+" : "-"}${transaction.amount}
                    </span>
                  </TableCell>
                  <TableCell>{transaction.type}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(transaction.status)}>
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{transaction.merchant}</TableCell>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>
                    <Badge className={getRiskColor(transaction.risk)}>
                      {transaction.risk}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver Detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
