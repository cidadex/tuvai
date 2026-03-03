import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCorrida } from '@/contexts/CorridaContext';
import type { Corrida } from '@/types';
import { 
  Truck, 
  Calendar, 
  MapPin, 
  Clock, 
  CheckCircle,
  Play,
  Flag,
  Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const MotoristaArea: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isMotorista, logout } = useAuth();
  const { 
    getCorridasMotorista, 
    getCorridasDisponiveis, 
    aceitarCorrida, 
    iniciarCorrida, 
    finalizarCorrida 
  } = useCorrida();
  
  const [minhasCorridas, setMinhasCorridas] = useState<Corrida[]>([]);
  const [corridasDisponiveis, setCorridasDisponiveis] = useState<Corrida[]>([]);
  const [activeTab, setActiveTab] = useState('disponiveis');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    if (!isMotorista) {
      navigate('/');
      return;
    }
    
    refreshData();
  }, [isAuthenticated, isMotorista, user, navigate]);

  const refreshData = () => {
    if (user) {
      setMinhasCorridas(getCorridasMotorista(user.id));
      setCorridasDisponiveis(getCorridasDisponiveis().filter(c => !c.motoristaId));
    }
  };

  const handleAceitar = (corridaId: string) => {
    if (user) {
      aceitarCorrida(corridaId, user.id);
      refreshData();
    }
  };

  const handleIniciar = (corridaId: string) => {
    iniciarCorrida(corridaId);
    refreshData();
  };

  const handleFinalizar = (corridaId: string) => {
    finalizarCorrida(corridaId);
    refreshData();
  };

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { label: string; color: string }> = {
      reservado: { label: 'Disponível', color: 'bg-blue-100 text-blue-700' },
      confirmado: { label: 'Confirmado', color: 'bg-green-100 text-green-700' },
      em_rota: { label: 'Em Rota', color: 'bg-orange-100 text-orange-700' },
      finalizado: { label: 'Finalizado', color: 'bg-gray-100 text-gray-700' },
      cancelado: { label: 'Cancelado', color: 'bg-red-100 text-red-700' },
    };
    const config = configs[status] || configs.reservado;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const corridasAtivas = minhasCorridas.filter(c => 
    c.status === 'confirmado' || c.status === 'em_rota'
  );

  const corridasCompletadas = minhasCorridas.filter(c => 
    c.status === 'finalizado'
  );

  if (!isAuthenticated || !isMotorista) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FF6B00] rounded-xl flex items-center justify-center">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg">Área do Motorista</h1>
                <p className="text-sm text-gray-500">{user?.nome}</p>
              </div>
            </div>
            <Button variant="outline" onClick={logout}>
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-[#FF6B00]">{corridasAtivas.length}</p>
              <p className="text-sm text-gray-500">Corridas Ativas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600">
                R$ {corridasCompletadas.reduce((acc, c) => acc + c.valorTotal, 0)}
              </p>
              <p className="text-sm text-gray-500">Total Ganho</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">{corridasCompletadas.length}</p>
              <p className="text-sm text-gray-500">Corridas Feitas</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="disponiveis">
              Disponíveis
              {corridasDisponiveis.length > 0 && (
                <span className="ml-2 bg-[#FF6B00] text-white text-xs px-2 py-0.5 rounded-full">
                  {corridasDisponiveis.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="minhas">
              Minhas Corridas
              {corridasAtivas.length > 0 && (
                <span className="ml-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {corridasAtivas.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="historico">Histórico</TabsTrigger>
          </TabsList>

          <TabsContent value="disponiveis">
            {corridasDisponiveis.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700">
                    Nenhuma corrida disponível
                  </h3>
                  <p className="text-gray-500">
                    Aguarde novos agendamentos.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {corridasDisponiveis.map((corrida) => (
                  <Card key={corrida.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        {getStatusBadge(corrida.status)}
                        <div className="text-right">
                          <p className="text-2xl font-bold text-[#FF6B00]">
                            R$ {corrida.valorTotal}
                          </p>
                          <p className="text-sm text-gray-500">
                            Sua parte: R$ {Math.round(corrida.valorTotal * 0.7)}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-[#FF6B00] mt-0.5" />
                          <span className="text-sm">
                            {corrida.origem.rua}, {corrida.origem.numero}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          {new Date(corrida.dataAgendada).toLocaleDateString('pt-BR')} às {corrida.horarioAgendado}
                        </div>
                      </div>

                      <Button 
                        onClick={() => handleAceitar(corrida.id)}
                        className="w-full bg-[#FF6B00] hover:bg-[#E55A00]"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Aceitar Corrida
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="minhas">
            {corridasAtivas.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700">
                    Você não tem corridas ativas
                  </h3>
                  <p className="text-gray-500">
                    Aceite corridas disponíveis para começar.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {corridasAtivas.map((corrida) => (
                  <Card key={corrida.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        {getStatusBadge(corrida.status)}
                        <div className="text-right">
                          <p className="text-2xl font-bold text-[#FF6B00]">
                            R$ {corrida.valorTotal}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-[#FF6B00] mt-0.5" />
                          <span className="text-sm">
                            {corrida.origem.rua}, {corrida.origem.numero}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          {new Date(corrida.dataAgendada).toLocaleDateString('pt-BR')} às {corrida.horarioAgendado}
                        </div>
                      </div>

                      {corrida.status === 'confirmado' && (
                        <Button 
                          onClick={() => handleIniciar(corrida.id)}
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Iniciar Corrida
                        </Button>
                      )}

                      {corrida.status === 'em_rota' && (
                        <Button 
                          onClick={() => handleFinalizar(corrida.id)}
                          className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                          <Flag className="w-4 h-4 mr-2" />
                          Finalizar Corrida
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="historico">
            {corridasCompletadas.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700">
                    Nenhuma corrida completada
                  </h3>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {corridasCompletadas.map((corrida) => (
                  <Card key={corrida.id} className="opacity-75">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        {getStatusBadge(corrida.status)}
                        <div className="text-right">
                          <p className="text-xl font-bold text-gray-700">
                            R$ {corrida.valorTotal}
                          </p>
                          <p className="text-sm text-green-600">
                            +R$ {Math.round(corrida.valorTotal * 0.7)}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 text-sm text-gray-500">
                        {new Date(corrida.dataAgendada).toLocaleDateString('pt-BR')} às {corrida.horarioAgendado}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default MotoristaArea;
