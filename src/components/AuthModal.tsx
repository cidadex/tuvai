import React, { useState } from 'react';
import { User, Car, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register-cliente' | 'register-motorista';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultTab = 'login' }) => {
  const { login, registerCliente, registerMotorista } = useAuth();
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Login form
  const [loginData, setLoginData] = useState({ telefone: '', senha: '' });

  // Cliente register form
  const [clienteData, setClienteData] = useState({
    nome: '',
    telefone: '',
    email: '',
  });

  // Motorista register form
  const [motoristaData, setMotoristaData] = useState({
    nome: '',
    telefone: '',
    cpf: '',
    cnh: '',
    placa: '',
    modelo: '',
    ano: '',
    pix: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const success = await login(loginData.telefone, loginData.senha);
    if (success) {
      setSuccess('Login realizado com sucesso!');
      setTimeout(() => {
        onClose();
        setSuccess('');
      }, 1000);
    } else {
      setError('Telefone não encontrado. Cadastre-se primeiro.');
    }

    setIsLoading(false);
  };

  const handleRegisterCliente = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const success = await registerCliente(clienteData);
    if (success) {
      setSuccess('Cadastro realizado com sucesso!');
      setTimeout(() => {
        onClose();
        setSuccess('');
      }, 1000);
    } else {
      setError('Telefone já cadastrado. Faça login.');
    }

    setIsLoading(false);
  };

  const handleRegisterMotorista = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const success = await registerMotorista(motoristaData);
    if (success) {
      setSuccess('Cadastro enviado! Sua conta está em análise.');
      setTimeout(() => {
        onClose();
        setSuccess('');
      }, 2000);
    } else {
      setError('Telefone já cadastrado.');
    }

    setIsLoading(false);
  };

  const formatTelefone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            {activeTab === 'login' && 'Bem-vindo de volta'}
            {activeTab === 'register-cliente' && 'Criar conta'}
            {activeTab === 'register-motorista' && 'Seja motorista'}
          </DialogTitle>
        </DialogHeader>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-600 p-3 rounded-lg flex items-center gap-2 text-sm">
            <Check className="w-4 h-4" />
            {success}
          </div>
        )}

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="login">Entrar</TabsTrigger>
            <TabsTrigger value="register-cliente">
              <User className="w-4 h-4 mr-1" />
              Cliente
            </TabsTrigger>
            <TabsTrigger value="register-motorista">
              <Car className="w-4 h-4 mr-1" />
              Motorista
            </TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="login-telefone">Telefone</Label>
                <Input
                  id="login-telefone"
                  placeholder="(11) 99999-9999"
                  value={loginData.telefone}
                  onChange={(e) => setLoginData({ ...loginData, telefone: formatTelefone(e.target.value) })}
                  maxLength={15}
                />
              </div>
              <div>
                <Label htmlFor="login-senha">Senha (opcional no MVP)</Label>
                <Input
                  id="login-senha"
                  type="password"
                  placeholder="••••••"
                  value={loginData.senha}
                  onChange={(e) => setLoginData({ ...loginData, senha: e.target.value })}
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#FF6B00] hover:bg-[#E55A00]"
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
              <p className="text-center text-sm text-gray-500">
                No MVP, basta informar o telefone cadastrado.
              </p>
            </form>
          </TabsContent>

          {/* Register Cliente Tab */}
          <TabsContent value="register-cliente">
            <form onSubmit={handleRegisterCliente} className="space-y-4">
              <div>
                <Label htmlFor="cliente-nome">Nome completo</Label>
                <Input
                  id="cliente-nome"
                  placeholder="Seu nome"
                  value={clienteData.nome}
                  onChange={(e) => setClienteData({ ...clienteData, nome: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="cliente-telefone">Telefone</Label>
                <Input
                  id="cliente-telefone"
                  placeholder="(11) 99999-9999"
                  value={clienteData.telefone}
                  onChange={(e) => setClienteData({ ...clienteData, telefone: formatTelefone(e.target.value) })}
                  maxLength={15}
                  required
                />
              </div>
              <div>
                <Label htmlFor="cliente-email">Email (opcional)</Label>
                <Input
                  id="cliente-email"
                  type="email"
                  placeholder="seu@email.com"
                  value={clienteData.email}
                  onChange={(e) => setClienteData({ ...clienteData, email: e.target.value })}
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#FF6B00] hover:bg-[#E55A00]"
                disabled={isLoading}
              >
                {isLoading ? 'Criando conta...' : 'Criar conta'}
              </Button>
            </form>
          </TabsContent>

          {/* Register Motorista Tab */}
          <TabsContent value="register-motorista">
            <form onSubmit={handleRegisterMotorista} className="space-y-4">
              <div>
                <Label htmlFor="motorista-nome">Nome completo</Label>
                <Input
                  id="motorista-nome"
                  placeholder="Seu nome"
                  value={motoristaData.nome}
                  onChange={(e) => setMotoristaData({ ...motoristaData, nome: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="motorista-telefone">Telefone</Label>
                <Input
                  id="motorista-telefone"
                  placeholder="(11) 99999-9999"
                  value={motoristaData.telefone}
                  onChange={(e) => setMotoristaData({ ...motoristaData, telefone: formatTelefone(e.target.value) })}
                  maxLength={15}
                  required
                />
              </div>
              <div>
                <Label htmlFor="motorista-cpf">CPF</Label>
                <Input
                  id="motorista-cpf"
                  placeholder="000.000.000-00"
                  value={motoristaData.cpf}
                  onChange={(e) => setMotoristaData({ ...motoristaData, cpf: formatCPF(e.target.value) })}
                  maxLength={14}
                  required
                />
              </div>
              <div>
                <Label htmlFor="motorista-cnh">CNH</Label>
                <Input
                  id="motorista-cnh"
                  placeholder="Número da CNH"
                  value={motoristaData.cnh}
                  onChange={(e) => setMotoristaData({ ...motoristaData, cnh: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="motorista-placa">Placa</Label>
                  <Input
                    id="motorista-placa"
                    placeholder="ABC1234"
                    value={motoristaData.placa}
                    onChange={(e) => setMotoristaData({ ...motoristaData, placa: e.target.value.toUpperCase() })}
                    maxLength={7}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="motorista-ano">Ano</Label>
                  <Input
                    id="motorista-ano"
                    placeholder="2020"
                    value={motoristaData.ano}
                    onChange={(e) => setMotoristaData({ ...motoristaData, ano: e.target.value })}
                    maxLength={4}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="motorista-modelo">Modelo do carro</Label>
                <Input
                  id="motorista-modelo"
                  placeholder="Fiat Uno"
                  value={motoristaData.modelo}
                  onChange={(e) => setMotoristaData({ ...motoristaData, modelo: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="motorista-pix">Chave PIX</Label>
                <Input
                  id="motorista-pix"
                  placeholder="CPF, email ou telefone"
                  value={motoristaData.pix}
                  onChange={(e) => setMotoristaData({ ...motoristaData, pix: e.target.value })}
                  required
                />
              </div>
              <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-600">
                <p>📎 No MVP completo, você enviaria fotos dos documentos.</p>
              </div>
              <Button
                type="submit"
                className="w-full bg-[#FF6B00] hover:bg-[#E55A00]"
                disabled={isLoading}
              >
                {isLoading ? 'Enviando...' : 'Enviar cadastro'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
