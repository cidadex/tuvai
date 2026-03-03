import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { CorridaProvider } from '@/contexts/CorridaContext';
import { initStorage, seedData } from '@/lib/storage';

// Sections
import Navbar from '@/sections/Navbar';
import Hero from '@/sections/Hero';
import ProblemSolution from '@/sections/ProblemSolution';
import HowItWorks from '@/sections/HowItWorks';
import Pricing from '@/sections/Pricing';
import Testimonials from '@/sections/Testimonials';
import DriverCTA from '@/sections/DriverCTA';
import FAQ from '@/sections/FAQ';
import FinalCTA from '@/sections/FinalCTA';
import Footer from '@/sections/Footer';

// Components
import AuthModal from '@/components/AuthModal';
import AgendamentoModal from '@/components/AgendamentoModal';

// Pages
import ClienteArea from '@/pages/ClienteArea';
import MotoristaArea from '@/pages/MotoristaArea';
import AdminArea from '@/pages/AdminArea';
import MotoristaCadastro from '@/pages/MotoristaCadastro';

// Landing Page Component
const LandingPage: React.FC = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [agendamentoModalOpen, setAgendamentoModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register-cliente' | 'register-motorista'>('login');

  // Listen for openAgendamento event
  useEffect(() => {
    const handleOpenAgendamento = () => {
      setAgendamentoModalOpen(true);
    };
    window.addEventListener('openAgendamento', handleOpenAgendamento);
    return () => window.removeEventListener('openAgendamento', handleOpenAgendamento);
  }, []);

  const handleLoginClick = () => {
    setAuthTab('login');
    setAuthModalOpen(true);
  };

  const handleAgendarClick = () => {
    setAgendamentoModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar 
        onLoginClick={handleLoginClick}
        onAgendarClick={handleAgendarClick}
      />
      
      <main>
        <Hero 
          onAgendarClick={handleAgendarClick}
        />
        <ProblemSolution />
        <HowItWorks />
        <Pricing onAgendarClick={handleAgendarClick} />
        <Testimonials />
        <DriverCTA />
        <FAQ />
        <FinalCTA onAgendarClick={handleAgendarClick} />
      </main>

      <Footer />

      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab={authTab}
      />

      <AgendamentoModal
        isOpen={agendamentoModalOpen}
        onClose={() => setAgendamentoModalOpen(false)}
      />
    </div>
  );
};

// App Component
function App() {
  // Initialize storage on mount
  useEffect(() => {
    initStorage();
    seedData();
  }, []);

  return (
    <AuthProvider>
      <CorridaProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/cliente" element={<ClienteArea />} />
            <Route path="/motorista" element={<MotoristaArea />} />
            <Route path="/admin" element={<AdminArea />} />
            <Route path="/cadastro-motorista" element={<MotoristaCadastro />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </CorridaProvider>
    </AuthProvider>
  );
}

export default App;
