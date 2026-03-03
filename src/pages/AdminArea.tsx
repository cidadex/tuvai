import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import type { Corrida, Motorista } from '@/types';
import { 
  Shield, 
  Truck, 
  DollarSign, 
  Calendar,
  CheckCircle,
  X,
  Package,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  getCorridas, 
  getMotoristas, 
  getMotoristasPendentes, 
  saveMotorista,
  getConfig,
  setConfig 
} from '@/lib/storage';

const AdminArea: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  
  const [corridas, setCorridas] = useState<Corrida[]>([]);
  const [motoristas, setMotoristas] = useState<Motorista[]>([]);
  const [motoristasPendentes, setMotoristasPendentes] = useState<Motorista[]>([]);
  const [localConfig, setLocalConfig] = useState(getConfig());
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    if (!isAdmin) {
      navigate('/');
      return;
    }
    
    refreshData();
  }, [isAuthenticated, isAdmin, navigate]);

  const refreshData = () => {
    setCorridas(getCorridas());
    setMotoristas(getMotoristas());
    setMotoristasPendentes(getMotoristasPendentes());
    setLocalConfig(getConfig());
  };

  const handleAprovarMotorista = (motoristaId: string) => {
    const motorista = motoristas.find(m => m.id === motoristaId);
    if (motorista) {
      motorista.status = 'aprovado';
      saveMotorista(motorista);
      refreshData();
    }
  };

  const handleRejeitarMotorista = (motoristaId: string) => {
    const motorista = motoristas.find(m => m.id === motoristaId);
    if (motorista) {
      motorista.status = 'rejeitado';
      saveMotorista(motorista);
      refreshData();
    }
  };

  const handleUpdateConfig = () => {
    setConfig(localConfig);
    refreshData();
  };

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { label: string; color: string }> = {
      em_analise: { label: 'Em Análise', color: 'bg-yellow-100 text-yellow-700' },
      aprovado: { label: 'Aprovado', color: 'bg-green-100 text-green-700' },
      rejeitado: { label: 'Rejeitado', color: 'bg-red-100 text-red-700' },
    };
    const cfg = configs[status] || configs.em_analise;
    return <Badge className={cfg.color}>{cfg.label}</Badge>;
  };

  // Stats
  const totalCorridas = corridas.length;
  const corridasHoje = corridas.filter(c => 
    c.dataAgendada === new Date().toISOString().split('T')[0]
  ).length;
  const totalFaturamento = corridas
    .filter(c => c.status === 'finalizado')
    .reduce((acc, c) => acc + c.valorTotal, 0);
  const motoristasAtivos = motoristas.filter(m => m.status === 'aprovado').length;

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <header className="bg-[#1A1A1A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FF6B00] rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg">Painel Administrativo</h1>
                <p className="text-sm text-gray-400">{user?.nome}</p>
              </div>
            </div>
            <Button variant="outline" onClick={logout} className="text-white border-white/30">
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="corridas">Corridas</TabsTrigger>
            <TabsTrigger value="motoristas">
              Motoristas
              {motoristasPendentes.length > 0 && (
                <span className="ml-2 bg-[#FF6B00] text-white text-xs px-2 py-0.5 rounded-full">
                  {motoristasPendentes.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="config">Configurações</TabsTrigger>
          </TabsList>

          {/* Dashboard */}
          <TabsContent value="dashboard">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Corridas</p>
                      <p className="text-3xl font-bold text-[#FF6B00]">{totalCorridas}</p>
                    </div>
                    <Package className="w-8 h-8 text-gray-300" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Hoje</p>
                      <p className="text-3xl font-bold text-blue-600">{corridasHoje}</p>
                    </div>
                    <Calendar className="w-8 h-8 text-gray-300" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Faturamento</p>
                      <p className="text-3xl font-bold text-green-600">
                        R$ {totalFaturamento}
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-gray-300" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Motoristas</p>
                      <p className="text-3xl font-bold text-purple-600">{motoristasAtivos}</p>
                    </div>
                    <Truck className="w-8 h-8 text-gray-300" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Corridas Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                {corridas.slice(0, 5).map((corrida) => (
                  <div key={corrida.id} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div>
                      <p className="font-medium">{corrida.origem.rua} → {corrida.destino.rua}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(corrida.dataAgendada).toLocaleDateString('pt-BR')} às {corrida.horarioAgendado}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">R$ {corrida.valorTotal}</p>
                      <Badge variant={corrida.status === 'finalizado' ? 'default' : 'secondary'}>
                        {corrida.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Corridas */}
          <TabsContent value="corridas">
            <Card>
              <CardHeader>
                <CardTitle>Todas as Corridas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Data</th>
                        <th className="text-left py-3 px-4">Origem</th>
                        <th className="text-left py-3 px-4">Destino</th>
                        <th className="text-left py-3 px-4">Valor</th>
                        <th className="text-left py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {corridas.map((corrida) => (
                        <tr key={corrida.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            {new Date(corrida.dataAgendada).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="py-3 px-4">{corrida.origem.rua}</td>
                          <td className="py-3 px-4">{corrida.destino.rua}</td>
                          <td className="py-3 px-4">R$ {corrida.valorTotal}</td>
                          <td className="py-3 px-4">
                            <Badge variant={corrida.status === 'finalizado' ? 'default' : 'secondary'}>
                              {corrida.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Motoristas */}
          <TabsContent value="motoristas">
            {/* Pendentes */}
            {motoristasPendentes.length > 0 && (
              <Card className="mb-6 border-yellow-200">
                <CardHeader>
                  <CardTitle className="text-yellow-700">Motoristas Pendentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {motoristasPendentes.map((motorista) => (
                      <div key={motorista.id} className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl">
                        <div>
                          <p className="font-semibold">{motorista.nome}</p>
                          <p className="text-sm text-gray-600">{motorista.telefone}</p>
                          <p className="text-sm text-gray-500">
                            {motorista.modelo} - {motorista.placa}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-200"
                            onClick={() => handleRejeitarMotorista(motorista.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleAprovarMotorista(motorista.id)}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Todos os motoristas */}
            <Card>
              <CardHeader>
                <CardTitle>Todos os Motoristas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Nome</th>
                        <th className="text-left py-3 px-4">Telefone</th>
                        <th className="text-left py-3 px-4">Veículo</th>
                        <th className="text-left py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {motoristas.map((motorista) => (
                        <tr key={motorista.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{motorista.nome}</td>
                          <td className="py-3 px-4">{motorista.telefone}</td>
                          <td className="py-3 px-4">{motorista.modelo} - {motorista.placa}</td>
                          <td className="py-3 px-4">{getStatusBadge(motorista.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Configurações */}
          <TabsContent value="config">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Preço</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label>Valor Mínimo (R$)</Label>
                    <Input
                      type="number"
                      value={localConfig.valorMinimo}
                      onChange={(e) => setLocalConfig({ ...localConfig, valorMinimo: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label>KM Inclusos</Label>
                    <Input
                      type="number"
                      value={localConfig.kmInclusos}
                      onChange={(e) => setLocalConfig({ ...localConfig, kmInclusos: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label>Valor KM Excedente (R$)</Label>
                    <Input
                      type="number"
                      step="0.10"
                      value={localConfig.valorKmExcedente}
                      onChange={(e) => setLocalConfig({ ...localConfig, valorKmExcedente: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label>Valor Reserva (R$)</Label>
                    <Input
                      type="number"
                      value={localConfig.valorReserva}
                      onChange={(e) => setLocalConfig({ ...localConfig, valorReserva: Number(e.target.value) })}
                    />
                  </div>
                </div>
                <Button 
                  onClick={handleUpdateConfig}
                  className="mt-6 bg-[#FF6B00] hover:bg-[#E55A00]"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Salvar Configurações
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminArea;
