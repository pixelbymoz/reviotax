import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Onboarding } from './pages/Onboarding';
import { Income } from './pages/Income';
import { Simulation } from './pages/Simulation';
import { Reports } from './pages/Reports';
import { About } from './pages/About';
import { WhatsNew } from './pages/WhatsNew';
import { Feedback } from './pages/Feedback';
import { NavigationPage, UserProfile, IncomeSource, OperationalCost, TaxCalculation } from './types';
import { calculateTax } from './utils/taxCalculations';

function App() {
  const [currentPage, setCurrentPage] = useState<NavigationPage>('dashboard');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>([]);
  const [operationalCosts, setOperationalCosts] = useState<OperationalCost[]>([]);
  const [taxCalculation, setTaxCalculation] = useState<TaxCalculation | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('taxify-profile');
    const savedIncome = localStorage.getItem('taxify-income');
    const savedCosts = localStorage.getItem('taxify-costs');

    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
    if (savedIncome) {
      setIncomeSources(JSON.parse(savedIncome));
    }
    if (savedCosts) {
      setOperationalCosts(JSON.parse(savedCosts));
    }
  }, []);

  // Recalculate tax whenever profile, income, or costs change
  useEffect(() => {
    if (profile) {
      const calculation = calculateTax(profile, incomeSources, operationalCosts);
      setTaxCalculation(calculation);
    } else {
      setTaxCalculation(null);
    }
  }, [profile, incomeSources, operationalCosts]);

  const handleSaveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    localStorage.setItem('taxify-profile', JSON.stringify(newProfile));
    setCurrentPage('dashboard');
  };

  const handleUpdateIncome = (newIncomeSources: IncomeSource[], newOperationalCosts: OperationalCost[]) => {
    setIncomeSources(newIncomeSources);
    setOperationalCosts(newOperationalCosts);
    localStorage.setItem('taxify-income', JSON.stringify(newIncomeSources));
    localStorage.setItem('taxify-costs', JSON.stringify(newOperationalCosts));
  };

  const handlePageChange = (page: NavigationPage) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard taxCalculation={taxCalculation} onNavigate={handlePageChange} />;
      case 'onboarding':
        return <Onboarding profile={profile} onSaveProfile={handleSaveProfile} />;
      case 'income':
        return (
          <Income
            incomeSources={incomeSources}
            operationalCosts={operationalCosts}
            onUpdateIncome={handleUpdateIncome}
          />
        );
      case 'simulation':
        return (
          <Simulation
            profile={profile}
            incomeSources={incomeSources}
            operationalCosts={operationalCosts}
            originalCalculation={taxCalculation}
          />
        );
      case 'reports':
        return <Reports profile={profile} taxCalculation={taxCalculation} />;
      case 'reminders':
        return (
          <div className="p-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Pengingat Pajak</h1>
              <p className="text-gray-600">
                Fitur pengingat pajak akan diimplementasikan di sini dengan integrasi kalender dan notifikasi.
              </p>
            </div>
          </div>
        );
      case 'about':
        return <About />;
      case 'whats-new':
        return <WhatsNew />;
      case 'feedback':
        return <Feedback />;
      default:
        return <Dashboard taxCalculation={taxCalculation} onNavigate={handlePageChange} />;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={handlePageChange}>
      {renderPage()}
    </Layout>
  );
}

export default App;