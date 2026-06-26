/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  initStorage, 
  getTravelers, 
  getTramites, 
  saveTramites, 
  updateTramite, 
  getTramiteByTravelerId 
} from './dbSim';
import { TravelerProfile, Tramite, UserRole } from './types';
import { ShieldCheck, LogOut, FileText } from 'lucide-react';

// Import Modular Screen Components
import RoleSwitcher from './components/RoleSwitcher';
import Login from './components/Login';
import Register from './components/Register';
import TravelerMenu from './components/TravelerMenu';
import SagDeclaration from './components/SagDeclaration';
import PdiDeclaration from './components/PdiDeclaration';
import VehicleRegistration from './components/VehicleRegistration';
import ProcedureStatus from './components/ProcedureStatus';
import SagInspectorPanel from './components/SagInspectorPanel';
import CustomsOfficerPanel from './components/CustomsOfficerPanel';
import FinalResult from './components/FinalResult';

export default function App() {
  // Initialization state
  const [dbInitialized, setDbInitialized] = useState(false);
  const [allTravelers, setAllTravelers] = useState<TravelerProfile[]>([]);
  const [allTramites, setAllTramites] = useState<Tramite[]>([]);

  // Active Role and Session states
  const [currentRole, setCurrentRole] = useState<UserRole>('viajero');
  const [currentTraveler, setCurrentTraveler] = useState<TravelerProfile | null>(null);

  // Screen routing states
  // For 'viajero': 'login' | 'register' | 'menu' | 'sag-form' | 'pdi-form' | 'vehicle-form' | 'status-view' | 'result-view'
  // For 'sag': 'sag-panel'
  // For 'aduana': 'aduana-panel'
  const [currentScreen, setCurrentScreen] = useState<string>('login');

  // Initialize DB on mount
  useEffect(() => {
    initStorage();
    setAllTravelers(getTravelers());
    setAllTramites(getTramites());
    setDbInitialized(true);
  }, []);

  // Reload lists when DB updates
  const reloadFromDb = () => {
    setAllTravelers(getTravelers());
    setAllTramites(getTramites());
  };

  // Helper to get active traveler's tramite
  const getActiveTramite = (): Tramite | null => {
    if (!currentTraveler) return null;
    const t = allTramites.find(item => item.travelerId === currentTraveler.id);
    return t || null;
  };

  const handleLogin = (role: UserRole, userProfile?: TravelerProfile) => {
    setCurrentRole(role);
    if (role === 'viajero' && userProfile) {
      setCurrentTraveler(userProfile);
      setCurrentScreen('menu');
    } else if (role === 'sag') {
      setCurrentTraveler(null);
      setCurrentScreen('sag-panel');
    } else if (role === 'aduana') {
      setCurrentTraveler(null);
      setCurrentScreen('aduana-panel');
    }
  };

  const handleLogout = () => {
    setCurrentTraveler(null);
    setCurrentRole('viajero');
    setCurrentScreen('login');
  };

  // Switch role override from the Top Demo Bar
  const handleSwitchRoleOverride = (role: UserRole, traveler?: TravelerProfile) => {
    setCurrentRole(role);
    if (role === 'viajero') {
      if (traveler) {
        setCurrentTraveler(traveler);
      } else if (allTravelers.length > 0) {
        // Fallback to second traveler (Maria) or first
        const defaultTraveler = allTravelers[1] || allTravelers[0];
        setCurrentTraveler(defaultTraveler);
      }
      setCurrentScreen('menu');
    } else if (role === 'sag') {
      setCurrentTraveler(null);
      setCurrentScreen('sag-panel');
    } else if (role === 'aduana') {
      setCurrentTraveler(null);
      setCurrentScreen('aduana-panel');
    }
  };

  // Reset database callback
  const handleResetDatabase = () => {
    localStorage.removeItem('aduana_travelers');
    localStorage.removeItem('aduana_tramites');
    initStorage();
    reloadFromDb();
    
    // Reset active session
    setCurrentTraveler(null);
    setCurrentRole('viajero');
    setCurrentScreen('login');
  };

  // Form Saving Handlers (Saves and adjusts status automatically)
  const handleSaveSag = (sagData: Tramite['sag']) => {
    const tramite = getActiveTramite();
    if (!tramite) return;

    const updatedTramite: Tramite = {
      ...tramite,
      sag: sagData
    };

    // Recheck pipeline status
    evaluatePipelineStatus(updatedTramite);
  };

  const handleSavePdi = (pdiData: Tramite['pdi']) => {
    const tramite = getActiveTramite();
    if (!tramite) return;

    const updatedTramite: Tramite = {
      ...tramite,
      pdi: pdiData
    };

    evaluatePipelineStatus(updatedTramite);
  };

  const handleSaveVehicle = (vehicleData: Tramite['vehicle']) => {
    const tramite = getActiveTramite();
    if (!tramite) return;

    const updatedTramite: Tramite = {
      ...tramite,
      vehicle: vehicleData
    };

    evaluatePipelineStatus(updatedTramite);
  };

  // Triage state machine for traveler's pipeline
  const evaluatePipelineStatus = (tramite: Tramite) => {
    const sagDone = tramite.sag.completed;
    const pdiDone = tramite.pdi.completed;
    const vehDone = tramite.vehicle.completed;

    let updatedStatus = tramite.status;
    let updatedDocsStatus = tramite.docsStatus;

    if (sagDone && pdiDone && vehDone) {
      // All done! If the status was in the register/individual phase, push it to SAG Review
      if (
        tramite.status === 'Registro' || 
        tramite.status === 'Declaración SAG' || 
        tramite.status === 'Declaración PDI' || 
        tramite.status === 'Vehículo'
      ) {
        updatedStatus = 'Revisión SAG';
        updatedDocsStatus = 'Pendiente de revisión';
      } else {
        updatedDocsStatus = 'Completa';
      }
    } else {
      updatedDocsStatus = 'Faltan documentos';
    }

    const finalTramite: Tramite = {
      ...tramite,
      status: updatedStatus,
      docsStatus: updatedDocsStatus
    };

    updateTramite(finalTramite);
    reloadFromDb();
  };

  // Administrative / Inspector update from tables
  const handleUpdateTramiteFromPanels = (updatedTramite: Tramite) => {
    updateTramite(updatedTramite);
    reloadFromDb();
  };

  if (!dbInitialized) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-blue-800 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-semibold text-sm">Cargando Sistema de Gestión Aduanera...</p>
        </div>
      </div>
    );
  }

  const activeTramite = getActiveTramite();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      {/* Top administrative Demo Bar */}
      <RoleSwitcher
        currentRole={currentRole}
        currentTraveler={currentTraveler}
        allTravelers={allTravelers}
        onSwitchRole={handleSwitchRoleOverride}
        onResetDatabase={handleResetDatabase}
      />

      {/* Main Banner / Brand Header (Only visible when not logged in to make login screen stand out) */}
      {currentScreen !== 'login' && currentScreen !== 'register' && (
        <header className="bg-[#004a99] text-white flex items-center justify-between px-6 py-4 shadow-md shrink-0" id="main-brand-header">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded flex items-center justify-center shadow-sm shrink-0">
                <ShieldCheck className="w-6 h-6 text-[#004a99]" />
              </div>
              <div>
                <span className="font-extrabold text-white tracking-tight text-sm sm:text-base uppercase font-display">Paso Fronterizo Los Libertadores</span>
                <p className="text-[10px] text-blue-100 font-bold uppercase tracking-wider -mt-0.5">Sistema Integrado de Control e Ingreso</p>
              </div>
            </div>

            {/* Profile indicator inside Header */}
            <div className="flex items-center gap-4">
              {currentRole === 'viajero' && currentTraveler ? (
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-bold text-white">{currentTraveler.fullName}</p>
                  <p className="text-[10px] text-blue-200 uppercase tracking-widest font-mono">{currentTraveler.rutOrPassport}</p>
                </div>
              ) : currentRole === 'sag' ? (
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-bold text-white">Inspector SAG</p>
                  <p className="text-[10px] text-blue-200 uppercase tracking-widest font-mono">Control Agrícola y Ganadero</p>
                </div>
              ) : currentRole === 'aduana' ? (
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-bold text-white">Funcionario Aduana</p>
                  <p className="text-[10px] text-blue-200 uppercase tracking-widest font-mono">Servicio Nacional de Aduanas</p>
                </div>
              ) : null}
              
              <button
                type="button"
                onClick={handleLogout}
                className="p-2 hover:bg-blue-800 text-white rounded-full transition duration-150 flex items-center justify-center cursor-pointer"
                title="Cerrar Sesión"
                id="btn-header-logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Main Application stage */}
      <main className="flex-grow">
        {/* Viajero flows */}
        {currentRole === 'viajero' && (
          <>
            {currentScreen === 'login' && (
              <Login 
                onLogin={handleLogin} 
                onNavigateToRegister={() => setCurrentScreen('register')} 
              />
            )}
            
            {currentScreen === 'register' && (
              <Register 
                onBackToLogin={() => setCurrentScreen('login')}
                onRegisterSuccess={() => {
                  reloadFromDb();
                  setCurrentScreen('login');
                }}
              />
            )}

            {currentScreen === 'menu' && currentTraveler && activeTramite && (
              <TravelerMenu
                profile={currentTraveler}
                tramite={activeTramite}
                onSelectAction={(action) => {
                  if (action === 'sag') setCurrentScreen('sag-form');
                  else if (action === 'pdi') setCurrentScreen('pdi-form');
                  else if (action === 'vehicle') setCurrentScreen('vehicle-form');
                  else if (action === 'status') setCurrentScreen('status-view');
                }}
                onLogout={handleLogout}
              />
            )}

            {currentScreen === 'sag-form' && activeTramite && (
              <SagDeclaration
                tramite={activeTramite}
                onSave={handleSaveSag}
                onBack={() => setCurrentScreen('menu')}
              />
            )}

            {currentScreen === 'pdi-form' && activeTramite && (
              <PdiDeclaration
                tramite={activeTramite}
                onSave={handleSavePdi}
                onBack={() => setCurrentScreen('menu')}
              />
            )}

            {currentScreen === 'vehicle-form' && activeTramite && (
              <VehicleRegistration
                tramite={activeTramite}
                onSave={handleSaveVehicle}
                onBack={() => setCurrentScreen('menu')}
              />
            )}

            {currentScreen === 'status-view' && activeTramite && (
              <ProcedureStatus
                tramite={activeTramite}
                onBack={() => setCurrentScreen('menu')}
                onNavigateToResult={() => setCurrentScreen('result-view')}
              />
            )}

            {currentScreen === 'result-view' && activeTramite && (
              <FinalResult
                tramite={activeTramite}
                onBack={() => setCurrentScreen('menu')}
              />
            )}
          </>
        )}

        {/* SAG Inspector flows */}
        {currentRole === 'sag' && (
          <SagInspectorPanel
            tramites={allTramites}
            onUpdateTramite={handleUpdateTramiteFromPanels}
          />
        )}

        {/* Customs Officer flows */}
        {currentRole === 'aduana' && (
          <CustomsOfficerPanel
            tramites={allTramites}
            onUpdateTramite={handleUpdateTramiteFromPanels}
          />
        )}
      </main>

      {/* Shared Professional Footer */}
      <footer className="bg-white border-t border-gray-150 py-4 px-6 text-center text-[10px] text-gray-400 font-medium">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 Servicio Nacional de Aduanas • SAG • PDI • República de Chile</p>
          <p className="flex items-center gap-1.5 font-mono">
            <span>Paso Fronterizo Los Libertadores • Sistema Oficial</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
