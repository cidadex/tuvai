import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCorrida } from '@/contexts/CorridaContext';
import type { Corrida } from '@/types';
import { 
  Package, 
  Calendar, 
  MapPin, 
  Clock, 
  X,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ClienteArea: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isCliente, logout } = useAuth();
  const { getCorridasCliente, cancelarCorrida } = useCorrida();
  const [corridas, setCorridas] = useState<Corrida[]>([]);
  const [activeTab, setActiveTab] = useState('ativas');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    if (!isCliente) {
      navigate('/');
      return;
    }
    
    if (user) {
      setCorridas(getCorridasCliente(user.id));
    }
  }, [isAuthenticated, isCliente, user, navigate, getCorridasCliente]);

  const corridasAtivas = corridas.filter(c => 
    c.status === 'reservado' || c.status === 'confirmado' || c.status === 'em_rota'
  );
  
  const corridasHistorico = corridas.filter(c => 
    c.status === 'finalizado' || c.status === 'cancelado'
  );

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { label: string; color: string }> = {
      reservado: { label: 'Reservado', color: 'bg-blue-100 text-blue-700' },
      confirmado: { label: 'Confirmado', color: 'bg-green-100 text-green-700' },
      em_rota: { label: 'Em Rota', color: 'bg-orange-100 text-orange-700' },
      finalizado: { label: 'Finalizado', color: 'bg-gray-100 text-gray-700' },
      cancelado: { label: 'Cancelado', color: 'bg-red-100 text-red-700' },
    };
    const config = configs[status] || configs.reservado;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const handleCancelar = (corridaId: string) => {
    if (confirm('Tem certeza que deseja cancelar este agendamento?')) {
      cancelarCorrida(corridaId);
      if (user) {
        setCorridas(getCorridasCliente(user.id));
      }
    }
  };

  const handleNovoAgendamento = () => {
    navigate('/');
    // Trigger agendamento modal via event
    window.dispatchEvent(new CustomEvent('openAgendamento'));
  };

  if (!isAuthenticated || !isCliente) {
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
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg">Área do Cliente</h1>
                <p className="text-sm text-gray-500">{user?.nome}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={handleNovoAgendamento}
                className="bg-[#FF6B00] hover:bg-[#E55A00]"
              >
                Novo Agendamento
              </Button>
              <Button variant="outline" onClick={logout}>
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="ativas">
              Agendamentos Ativos
              {corridasAtivas.length > 0 && (
                <span className="ml-2 bg-[#FF6B00] text-white text-xs px-2 py-0.5 rounded-full">
                  {corridasAtivas.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="historico">Histórico</TabsTrigger>
          </TabsList>

          <TabsContent value="ativas">
            {corridasAtivas.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Nenhum agendamento ativo
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Você não tem corridas agendadas no momento.
                  </p>
                  <Button 
                    onClick={handleNovoAgendamento}
                    className="bg-[#FF6B00] hover:bg-[#E55A00]"
                  >
                    Fazer Primeiro Agendamento
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {corridasAtivas.map((corrida) => (
                  <Card key={corrida.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        {getStatusBadge(corrida.status)}
                        <div className="text-right">
                          <p className="text-2xl font-bold text-[#FF6B00]">
                            R$ {corrida.valorTotal}
                          </p>
                          <p className="text-sm text-gray-500">
                            Reserva: R$ {corrida.valorReserva}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-[#FF6B00] mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-500">Origem</p>
                            <p className="font-medium">
                              {corrida.origem.rua}, {corrida.origem.numero}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mt-0.5">
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Destino</p>
                            <p className="font-medium">
                              {corrida.destino.rua}, {corrida.destino.numero}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 pt-3 border-t">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">
                              {new Date(corrida.dataAgendada).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">{corrida.horarioAgendado}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-gray-400" />
                            <span className="text-sm capitalize">{corrida.tipoCompra}</span>
                          </div>
                        </div>
                      </div>

                      {corrida.status === 'reservado' && (
                        <div className="mt-4 pt-4 border-t flex justify-end">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleCancelar(corrida.id)}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Cancelar
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="historico">
            {corridasHistorico.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Nenhum histórico
                  </h3>
                  <p className="text-gray-500">
                    Suas corridas finalizadas aparecerão aqui.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {corridasHistorico.map((corrida) => (
                  <Card key={corrida.id} className="opacity-75">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        {getStatusBadge(corrida.status)}
                        <div className="text-right">
                          <p className="text-xl font-bold text-gray-700">
                            R$ {corrida.valorTotal}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <span>{new Date(corrida.dataAgendada).toLocaleDateString('pt-BR')}</span>
                        <span>{corrida.horarioAgendado}</span>
                        <span className="capitalize">{corrida.tipoCompra}</span>
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

export default ClienteArea;
