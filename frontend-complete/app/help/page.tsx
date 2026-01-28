"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";
import {
  HelpCircle,
  Search,
  BookOpen,
  MessageSquare,
  Phone,
  Mail,
  FileText,
  Video,
  Download,
  ChevronRight
} from "lucide-react";

const faqs = [
  {
    question: "Como adicionar uma nova conta?",
    answer: "Para adicionar uma nova conta, vá para a página 'Contas' e clique no botão 'Nova Conta'. Preencha as informações necessárias e clique em 'Salvar'."
  },
  {
    question: "Como configurar alertas personalizados?",
    answer: "Na página 'Alertas', você pode configurar regras personalizadas. Clique em 'Nova Regra' e defina as condições desejadas."
  },
  {
    question: "Como exportar relatórios?",
    answer: "Vá para a página 'Relatórios', selecione o relatório desejado e clique no ícone de download. Os relatórios podem ser exportados em PDF, Excel ou CSV."
  },
  {
    question: "O que fazer em caso de fraude detectada?",
    answer: "O sistema notificará automaticamente. Você pode revisar o alerta na página 'Detecção de Fraude' e tomar as ações apropriadas."
  },
  {
    question: "Como alterar minhas configurações de segurança?",
    answer: "Acesse 'Configurações' > 'Segurança' para ajustar autenticação de dois fatores, timeout de sessão e outras opções."
  }
];

const quickGuides = [
  { title: "Primeiros Passos", icon: BookOpen, description: "Guia completo para começar", time: "5 min" },
  { title: "Análise de Dados", icon: FileText, description: "Como interpretar os gráficos", time: "10 min" },
  { title: "Configuração Avançada", icon: Settings, description: "Configurações do sistema", time: "15 min" },
  { title: "Tutoriais em Vídeo", icon: Video, description: "Vídeos explicativos", time: "Vários" },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleContact = () => {
    toast.success("Sua mensagem foi enviada! Entraremos em contato em até 24h.");
  };

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <HelpCircle className="h-8 w-8 text-blue-600" />
            Central de Ajuda
          </h1>
          <p className="text-gray-500">Encontre respostas e suporte para suas dúvidas</p>
        </div>
      </div>

      {/* Busca */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
            <Input
              placeholder="Como posso ajudar você hoje? Busque por dúvidas, problemas ou funcionalidades..."
              className="pl-10 text-lg py-6"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Guias Rápidos */}
      <div>
        <h2 className="text-xl font-bold mb-4">Guias Rápidos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickGuides.map((guide, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="p-3 rounded-full bg-blue-100">
                    <guide.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold">{guide.title}</h3>
                  <p className="text-sm text-gray-500">{guide.description}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Clock className="h-4 w-4" />
                    {guide.time}
                  </div>
                  <Button variant="ghost" size="sm" className="mt-2">
                    Acessar <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FAQ */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Perguntas Frequentes (FAQ)</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="space-y-2">
              {filteredFaqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline py-3">
                    <span className="text-left font-medium">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-3 text-gray-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Contato */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Entre em Contato
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-blue-100">
                  <Phone className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Telefone</p>
                  <p className="text-sm text-gray-500">(11) 9999-8888</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-green-100">
                  <Mail className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-gray-500">suporte@fintrack.com</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-purple-100">
                  <MessageSquare className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Chat Online</p>
                  <p className="text-sm text-gray-500">Disponível 24/7</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium">Envie uma mensagem</h3>
              <Input placeholder="Seu nome" />
              <Input placeholder="Seu email" type="email" />
              <textarea
                placeholder="Descreva sua dúvida ou problema..."
                className="w-full min-h-[100px] p-2 border rounded-md"
              />
              <Button className="w-full" onClick={handleContact}>
                Enviar Mensagem
              </Button>
            </div>

            <div className="pt-4 border-t">
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Baixar Documentação Completa
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Componente auxiliar
function Settings(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function Clock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
