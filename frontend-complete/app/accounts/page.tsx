"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  MoreVertical,
  CreditCard,
  Building,
  Wallet
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const mockAccounts = [
  { id: "ACC001", name: "João Silva", email: "joao@email.com", type: "Pessoa Física", status: "Ativo", balance: 12500.50, lastLogin: "15/03/2024" },
  { id: "ACC002", name: "Empresa XYZ Ltda", email: "contato@xyz.com", type: "Pessoa Jurídica", status: "Ativo", balance: 85420.75, lastLogin: "14/03/2024" },
  { id: "ACC003", name: "Maria Santos", email: "maria@email.com", type: "Pessoa Física", status: "Suspenso", balance: 3200.00, lastLogin: "10/03/2024" },
  { id: "ACC004", name: "Tech Solutions SA", email: "admin@techsolutions.com", type: "Pessoa Jurídica", status: "Ativo", balance: 152300.25, lastLogin: "15/03/2024" },
  { id: "ACC005", name: "Carlos Oliveira", email: "carlos@email.com", type: "Pessoa Física", status: "Inativo", balance: 500.00, lastLogin: "01/03/2024" },
  { id: "ACC006", name: "Consultoria ABC", email: "info@consultoriaabc.com", type: "Pessoa Jurídica", status: "Ativo", balance: 75300.80, lastLogin: "14/03/2024" },
];

export default function AccountsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredAccounts = mockAccounts.filter(account => {
    const matchesSearch = 
      account.name.toLowerCase().includes(search.toLowerCase()) ||
      account.email.toLowerCase().includes(search.toLowerCase()) ||
      account.id.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || account.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativo": return "bg-green-100 text-green-800";
      case "Suspenso": return "bg-yellow-100 text-yellow-800";
      case "Inativo": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    return type === "Pessoa Física" ? <UserPlus className="h-4 w-4" /> : <Building className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8 text-blue-600" />
            Gerenciamento de Contas
          </h1>
          <p className="text-gray-500">Gerencie todas as contas do sistema</p>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Nova Conta
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Contas</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,542</div>
            <p className="text-xs text-gray-500">+12 este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contas Ativas</CardTitle>
            <CreditCard className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,489</div>
            <p className="text-xs text-gray-500">96.5% do total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
            <Wallet className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 42.5M</div>
            <p className="text-xs text-gray-500">Em todas as contas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média por Conta</CardTitle>
            <Building className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 27,560</div>
            <p className="text-xs text-gray-500">Saldo médio</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar contas por nome, email ou ID..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>
                Todas
              </Button>
              <Button variant={filter === "Ativo" ? "default" : "outline"} onClick={() => setFilter("Ativo")}>
                Ativas
              </Button>
              <Button variant={filter === "Suspenso" ? "default" : "outline"} onClick={() => setFilter("Suspenso")}>
                Suspensas
              </Button>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Mais Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Lista de Contas</CardTitle>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Saldo</TableHead>
                <TableHead>Último Login</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAccounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell className="font-medium">{account.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(account.type)}
                      {account.name}
                    </div>
                  </TableCell>
                  <TableCell>{account.email}</TableCell>
                  <TableCell>{account.type}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(account.status)}>
                      {account.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    R$ {account.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>{account.lastLogin}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
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
