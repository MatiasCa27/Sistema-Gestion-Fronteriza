/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  UserCog, 
  FileCheck, 
  BarChart3, 
  Settings, 
  LogOut, 
  Plus, 
  Edit, 
  Trash2, 
  UserCheck, 
  UserX, 
  Search, 
  X, 
  CheckCircle, 
  ShieldAlert,
  Calendar,
  Layers,
  UserSquare2,
  FileText
} from 'lucide-react';
import { UserRole, TravelerProfile, SystemProfile } from '../types';
import { getTravelers, getProfiles, saveProfiles, saveTravelers } from '../dbSim';

interface AdminPanelProps {
  onLogout: () => void;
}

type AdminTab = 'dashboard' | 'usuarios' | 'perfiles' | 'documentos' | 'reportes' | 'config';

export default function AdminPanel({ onLogout }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [travelers, setTravelers] = useState<TravelerProfile[]>([]);
  const [profiles, setProfiles] = useState<SystemProfile[]>([]);

  // Search/Filters states
  const [profileSearchTerm, setProfileSearchTerm] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');

  // Modal / Form States
  const [isCreateProfileOpen, setIsCreateProfileOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<SystemProfile | null>(null);
  
  // Create Profile Form Inputs
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('pdi');

  // Success Messages / Alerts
  const [alertMessage, setAlertMessage] = useState<{ text: string; type: 'success' | 'info' | 'danger' } | null>(null);

  // Load data on mount
  useEffect(() => {
    setTravelers(getTravelers());
    setProfiles(getProfiles());
  }, []);

  const refreshData = () => {
    setTravelers(getTravelers());
    setProfiles(getProfiles());
  };

  const showAlert = (text: string, type: 'success' | 'info' | 'danger' = 'success') => {
    setAlertMessage({ text, type });
    setTimeout(() => {
      setAlertMessage(null);
    }, 4000);
  };

  // Helper translations for roles
  const getRoleLabel = (r: UserRole): string => {
    switch (r) {
      case 'admin': return 'Administrador';
      case 'aduana': return 'Funcionario Aduana';
      case 'pdi': return 'Funcionario PDI';
      case 'sag': return 'Inspector SAG';
      case 'viajero': return 'Viajero';
      default: return r;
    }
  };

  // Profile managers
  const handleOpenCreateProfile = () => {
    setFullName('');
    setEmail('');
    setPassword('');
    setRole('pdi');
    setIsCreateProfileOpen(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      alert("Por favor rellene todos los campos.");
      return;
    }

    // Verify duplicate emails in profiles or travelers
    const emailExists = profiles.some(p => p.email.toLowerCase() === email.toLowerCase()) || 
                        travelers.some(t => t.email.toLowerCase() === email.toLowerCase());
    
    if (emailExists) {
      alert("El correo electrónico ingresado ya se encuentra registrado.");
      return;
    }

    const newProfile: SystemProfile = {
      id: `prof-${Date.now()}`,
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      password: password,
      role: role,
      status: 'Activo',
      dateCreated: new Date().toISOString()
    };

    const updatedProfiles = [...profiles, newProfile];
    saveProfiles(updatedProfiles);
    setProfiles(updatedProfiles);
    setIsCreateProfileOpen(false);

    // If traveler role is selected, also add as a traveler profile for seamless testing!
    if (role === 'viajero') {
      const newTraveler: TravelerProfile = {
        id: `user-t-${Date.now()}`,
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        password: password,
        rutOrPassport: `TEMP-${Math.floor(Math.random() * 90000000) + 10000000}`,
        nationality: 'Chilena',
        phone: '+56900000000'
      };
      const updatedTravelers = [...travelers, newTraveler];
      saveTravelers(updatedTravelers);
      setTravelers(updatedTravelers);
    }

    showAlert("Perfil creado correctamente.", 'success');
    refreshData();
  };

  const handleOpenEditProfile = (profile: SystemProfile) => {
    setEditingProfile(profile);
    setFullName(profile.fullName);
    setEmail(profile.email);
    setRole(profile.role);
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingProfile) return;
    if (!fullName.trim() || !email.trim()) {
      alert("Por favor rellene todos los campos requeridos.");
      return;
    }

    const updatedProfiles = profiles.map(p => {
      if (p.id === editingProfile.id) {
        return {
          ...p,
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          role: role,
          status: p.status // Status is managed separately by buttons
        };
      }
      return p;
    });

    saveProfiles(updatedProfiles);
    setProfiles(updatedProfiles);
    setEditingProfile(null);
    showAlert("Perfil actualizado correctamente.", 'success');
    refreshData();
  };

  const handleToggleStatus = (profileId: string, currentStatus: 'Activo' | 'Inactivo') => {
    const nextStatus = currentStatus === 'Activo' ? 'Inactivo' : 'Activo';
    const updated = profiles.map(p => {
      if (p.id === profileId) {
        return { ...p, status: nextStatus };
      }
      return p;
    });
    saveProfiles(updated);
    setProfiles(updated);
    showAlert(`Perfil ${nextStatus === 'Activo' ? 'activado' : 'desactivado'} correctamente.`, 'info');
  };

  const handleDeleteProfile = (profileId: string, name: string) => {
    if (confirm(`¿Está seguro que desea eliminar permanentemente el perfil de ${name}?`)) {
      const filtered = profiles.filter(p => p.id !== profileId);
      saveProfiles(filtered);
      setProfiles(filtered);
      showAlert("Perfil eliminado correctamente.", 'danger');
    }
  };

  // Filter profiles for display
  const filteredProfiles = profiles.filter(p => {
    const search = profileSearchTerm.toLowerCase();
    return p.fullName.toLowerCase().includes(search) || 
           p.email.toLowerCase().includes(search) ||
           getRoleLabel(p.role).toLowerCase().includes(search);
  });

  // Filter travelers for display
  const filteredTravelers = travelers.filter(t => {
    const search = userSearchTerm.toLowerCase();
    return t.fullName.toLowerCase().includes(search) || 
           t.email.toLowerCase().includes(search) ||
           t.rutOrPassport.toLowerCase().includes(search);
  });

  // Dashboard calculations
  const totalUsers = travelers.length + profiles.length;
  const pdiCount = profiles.filter(p => p.role === 'pdi').length;
  const aduanaCount = profiles.filter(p => p.role === 'aduana').length;
  const sagCount = profiles.filter(p => p.role === 'sag').length;
  const travelersCount = travelers.length;
  const activeProfilesCount = profiles.filter(p => p.status === 'Activo').length;
  const inactiveProfilesCount = profiles.filter(p => p.status === 'Inactivo').length;

  return (
    <div className="flex min-h-[85vh] bg-slate-50 animate-fade-in" id="admin-panel-container">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col shrink-0" id="admin-sidebar">
        {/* User Info inside Sidebar */}
        <div className="p-6 border-b border-slate-800 bg-slate-950 flex items-center gap-3">
          <div className="bg-blue-600 p-2.5 rounded-lg text-white">
            <UserCog className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-sm text-white tracking-tight font-display">Administración</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Control Maestro</p>
          </div>
        </div>

        {/* Sidebar buttons list */}
        <nav className="flex-grow p-4 space-y-1">
          {/* Dashboard */}
          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wide transition duration-150 cursor-pointer ${
              activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </button>

          {/* Gestión de Usuarios */}
          <button
            type="button"
            onClick={() => setActiveTab('usuarios')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wide transition duration-150 cursor-pointer ${
              activeTab === 'usuarios' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" /> Gestión de Usuarios
          </button>

          {/* Gestión de Perfiles */}
          <button
            type="button"
            onClick={() => setActiveTab('perfiles')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wide transition duration-150 cursor-pointer ${
              activeTab === 'perfiles' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <UserSquare2 className="w-4 h-4" /> Gestión de Perfiles
          </button>

          {/* Gestión de Documentos */}
          <button
            type="button"
            onClick={() => setActiveTab('documentos')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wide transition duration-150 cursor-pointer ${
              activeTab === 'documentos' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <FileCheck className="w-4 h-4" /> Gestión de Documentos
          </button>

          {/* Reportes */}
          <button
            type="button"
            onClick={() => setActiveTab('reportes')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wide transition duration-150 cursor-pointer ${
              activeTab === 'reportes' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" /> Reportes
          </button>

          {/* Configuración */}
          <button
            type="button"
            onClick={() => setActiveTab('config')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wide transition duration-150 cursor-pointer ${
              activeTab === 'config' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" /> Configuración
          </button>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950">
          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg font-bold text-xs uppercase tracking-wide transition duration-150 cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-8 overflow-y-auto space-y-6">
        
        {/* Alert Notifications */}
        {alertMessage && (
          <div className={`p-4 border rounded-xl flex items-center gap-3 animate-fade-in shadow-xs ${
            alertMessage.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
            alertMessage.type === 'danger' ? 'bg-red-50 border-red-200 text-red-800' :
            'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            <CheckCircle className="w-5 h-5 shrink-0" />
            <p className="font-bold text-xs uppercase tracking-wider font-display">{alertMessage.text}</p>
          </div>
        )}

        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 uppercase font-display tracking-tight">Dashboard General</h1>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Métricas, perfiles y estadísticas integradas del sistema</p>
            </div>

            {/* Bento Grid cards requested */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Total de usuarios */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2 flex flex-col justify-between hover:border-slate-350 transition">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10px] uppercase tracking-wider font-bold">Total Usuarios Registrados</span>
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-slate-900 tracking-tight font-display">{totalUsers}</p>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Cuentas globales activas</p>
                </div>
              </div>

              {/* Funcionarios PDI */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2 flex flex-col justify-between hover:border-slate-350 transition">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10px] uppercase tracking-wider font-bold">Funcionarios PDI</span>
                  <UserCheck className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-slate-900 tracking-tight font-display">{pdiCount}</p>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Policía de Investigaciones</p>
                </div>
              </div>

              {/* Funcionarios Aduana */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2 flex flex-col justify-between hover:border-slate-350 transition">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10px] uppercase tracking-wider font-bold">Funcionarios Aduana</span>
                  <UserSquare2 className="w-5 h-5 text-sky-600" />
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-slate-900 tracking-tight font-display">{aduanaCount}</p>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Servicio Nac. Aduanas</p>
                </div>
              </div>

              {/* Inspectores SAG */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2 flex flex-col justify-between hover:border-slate-350 transition">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10px] uppercase tracking-wider font-bold">Inspectores SAG</span>
                  <UserCheck className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-slate-900 tracking-tight font-display">{sagCount}</p>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Control Agrícola y Ganadero</p>
                </div>
              </div>

              {/* Viajeros registrados */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2 flex flex-col justify-between hover:border-slate-350 transition">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10px] uppercase tracking-wider font-bold">Viajeros Registrados</span>
                  <Users className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-slate-900 tracking-tight font-display">{travelersCount}</p>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Tránsitos migratorios</p>
                </div>
              </div>

              {/* Perfiles Activos */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2 flex flex-col justify-between hover:border-slate-350 transition">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10px] uppercase tracking-wider font-bold">Perfiles Activos</span>
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-slate-900 tracking-tight font-display">{activeProfilesCount}</p>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Cuentas habilitadas</p>
                </div>
              </div>

              {/* Perfiles Inactivos */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2 flex flex-col justify-between hover:border-slate-350 transition">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10px] uppercase tracking-wider font-bold">Perfiles Inactivos</span>
                  <UserX className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-slate-900 tracking-tight font-display">{inactiveProfilesCount}</p>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Cuentas suspendidas</p>
                </div>
              </div>
            </div>

            {/* Quick overview panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                <h3 className="font-extrabold text-sm text-slate-950 uppercase tracking-wider font-display border-b pb-2">Distribución de Personal</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">Administradores del Sistema</span>
                    <span className="bg-slate-100 text-slate-700 font-mono font-bold px-2 py-0.5 rounded">
                      {profiles.filter(p => p.role === 'admin').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">Inspectores SAG de Frontera</span>
                    <span className="bg-slate-100 text-slate-700 font-mono font-bold px-2 py-0.5 rounded">{sagCount}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">Funcionarios PDI de Migración</span>
                    <span className="bg-slate-100 text-slate-700 font-mono font-bold px-2 py-0.5 rounded">{pdiCount}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">Oficiales de Aduana Chilena</span>
                    <span className="bg-slate-100 text-slate-700 font-mono font-bold px-2 py-0.5 rounded">{aduanaCount}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-950 uppercase tracking-wider font-display border-b pb-2">Estado de Conectividad</h3>
                  <p className="text-xs text-slate-500 leading-relaxed pt-2">
                    El sistema se encuentra sincronizado localmente con las bases de datos de Interpol, Registro Civil y el Ministerio de Agricultura. Todos los módulos operativos operan en alta disponibilidad.
                  </p>
                </div>
                <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl text-xs font-mono text-slate-500">
                  <div className="flex items-center gap-1.5 text-emerald-600 font-bold mb-1">
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    <span>SISTEMAS OPERATIVOS EN LÍNEA</span>
                  </div>
                  <p className="text-[10px]">API Gateways: OK • Dactilar SDK: OK • Servidores: Los Libertadores (Local Container)</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: GESTIÓN DE USUARIOS */}
        {activeTab === 'usuarios' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-extrabold text-slate-900 uppercase font-display tracking-tight">Gestión de Usuarios (Viajeros)</h1>
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Historial de cuentas registradas de viajeros y extranjeros</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-200 bg-slate-50/50">
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Buscar viajero por nombre o documento..."
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                    className="w-full bg-white pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#004a99] transition font-medium"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/70 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 font-display">
                      <th className="py-3 px-6">ID</th>
                      <th className="py-3 px-6">Nombre Completo</th>
                      <th className="py-3 px-6">RUT / Pasaporte</th>
                      <th className="py-3 px-6">Nacionalidad</th>
                      <th className="py-3 px-6">Contacto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 text-xs font-medium">
                    {filteredTravelers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 px-6 text-center text-slate-400 italic">
                          No se encontraron viajeros registrados.
                        </td>
                      </tr>
                    ) : (
                      filteredTravelers.map((traveler) => (
                        <tr key={traveler.id} className="hover:bg-slate-50/50">
                          <td className="py-4 px-6 font-mono text-slate-400">{traveler.id}</td>
                          <td className="py-4 px-6 font-bold text-slate-800">{traveler.fullName}</td>
                          <td className="py-4 px-6 font-mono font-bold bg-slate-50 border px-2 py-0.5 rounded text-slate-700">{traveler.rutOrPassport}</td>
                          <td className="py-4 px-6 text-slate-600">{traveler.nationality}</td>
                          <td className="py-4 px-6 text-slate-500">
                            <div>{traveler.email}</div>
                            <div>{traveler.phone}</div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: GESTIÓN DE PERFILES */}
        {activeTab === 'perfiles' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-extrabold text-slate-900 uppercase font-display tracking-tight">Gestión de Perfiles</h1>
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Cuentas de oficiales, autoridades e inspectores autorizados del sistema</p>
              </div>
              <button
                type="button"
                onClick={handleOpenCreateProfile}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-lg text-xs uppercase tracking-wide transition shadow-sm hover:shadow cursor-pointer flex items-center gap-1.5 self-start font-display"
              >
                <Plus className="w-4 h-4" /> Crear Perfil
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-200 bg-slate-50/50">
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Buscar perfil por nombre, correo o rol..."
                    value={profileSearchTerm}
                    onChange={(e) => setProfileSearchTerm(e.target.value)}
                    className="w-full bg-white pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#004a99] transition font-medium"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/70 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 font-display">
                      <th className="py-3 px-6">Nombre</th>
                      <th className="py-3 px-6">Rol</th>
                      <th className="py-3 px-6 text-center">Estado</th>
                      <th className="py-3 px-6">Fecha de Creación</th>
                      <th className="py-3 px-6 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 text-xs font-medium">
                    {filteredProfiles.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 px-6 text-center text-slate-400 italic">
                          No se encontraron perfiles de usuario.
                        </td>
                      </tr>
                    ) : (
                      filteredProfiles.map((p) => {
                        const isActive = p.status === 'Activo';

                        return (
                          <tr key={p.id} className="hover:bg-slate-50/50 transition">
                            <td className="py-4 px-6">
                              <div className="font-bold text-slate-800">{p.fullName}</div>
                              <div className="text-[10px] text-slate-400 font-mono">{p.email}</div>
                            </td>
                            <td className="py-4 px-6">
                              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-bold text-[10px] uppercase">
                                {getRoleLabel(p.role)}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-center">
                              {isActive ? (
                                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider border border-emerald-200">
                                  Activo
                                </span>
                              ) : (
                                <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-wider border border-red-200">
                                  Inactivo
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-6 text-slate-500 flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              <span>{new Date(p.dateCreated).toLocaleDateString()}</span>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center justify-center gap-1.5">
                                
                                {/* Editar perfil */}
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditProfile(p)}
                                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-250 rounded transition cursor-pointer flex items-center justify-center"
                                  title="Editar perfil"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>

                                {/* Activar / Desactivar perfil */}
                                {isActive ? (
                                  <button
                                    type="button"
                                    onClick={() => handleToggleStatus(p.id, 'Activo')}
                                    className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded transition cursor-pointer flex items-center justify-center"
                                    title="Desactivar perfil"
                                  >
                                    <UserX className="w-3.5 h-3.5" />
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleToggleStatus(p.id, 'Inactivo')}
                                    className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded transition cursor-pointer flex items-center justify-center"
                                    title="Activar perfil"
                                  >
                                    <UserCheck className="w-3.5 h-3.5" />
                                  </button>
                                )}

                                {/* Eliminar perfil */}
                                <button
                                  type="button"
                                  onClick={() => handleDeleteProfile(p.id, p.fullName)}
                                  className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded transition cursor-pointer flex items-center justify-center"
                                  title="Eliminar perfil"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: GESTIÓN DE DOCUMENTOS */}
        {activeTab === 'documentos' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 uppercase font-display tracking-tight">Gestión de Documentos</h1>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Repositorio de declaraciones físicas firmadas electrónicamente</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500 space-y-4">
              <div className="flex justify-center">
                <FileText className="w-12 h-12 text-[#004a99] opacity-70" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Gestor de Archivos Migratorios y de Aduana</h3>
              <p className="text-xs max-w-md mx-auto leading-relaxed">
                Este módulo compila todas las declaraciones SAG, PDI y de registro de vehículos firmadas electrónicamente por los viajeros en formato PDF para su archivo y auditoría.
              </p>
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-left text-xs font-mono max-w-lg mx-auto space-y-1">
                <p>🗁 Carpeta: /archivado/declaraciones-2026/06/</p>
                <p>• DECL_SAG_12345678-9.pdf (Firmado - 122 KB)</p>
                <p>• DECL_PDI_BR543210.pdf (Firmado - 94 KB)</p>
                <p>• VEH_REG_K-HS-789.pdf (Firmado - 105 KB)</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: REPORTES */}
        {activeTab === 'reportes' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 uppercase font-display tracking-tight">Reportes y Estadísticas</h1>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Reportes analíticos de tránsitos y retenciones de mercadería</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider font-display border-b pb-1.5">Eficiencia del Paso Fronterizo</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between font-medium"><span>Tiempo promedio de atención PDI:</span> <span className="font-bold text-[#004a99]">3.4 min</span></div>
                  <div className="flex justify-between font-medium"><span>Tiempo promedio de inspección SAG:</span> <span className="font-bold text-emerald-600">5.8 min</span></div>
                  <div className="flex justify-between font-medium"><span>Tiempo promedio despacho Aduana:</span> <span className="font-bold text-sky-600">4.1 min</span></div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden mt-1 flex">
                    <div className="bg-indigo-500 h-full" style={{ width: '25%' }}></div>
                    <div className="bg-emerald-500 h-full" style={{ width: '45%' }}></div>
                    <div className="bg-sky-500 h-full" style={{ width: '30%' }}></div>
                  </div>
                </div>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider font-display border-b pb-1.5">Tránsitos por Nacionalidad</h4>
                <ul className="space-y-2 text-xs font-medium text-slate-600">
                  <li className="flex justify-between"><span>🇨🇱 Chilena:</span> <span className="font-bold">48%</span></li>
                  <li className="flex justify-between"><span>🇦🇷 Argentina:</span> <span className="font-bold">35%</span></li>
                  <li className="flex justify-between"><span>🇧🇷 Brasileña:</span> <span className="font-bold">12%</span></li>
                  <li className="flex justify-between"><span>🇩🇪 Otras nacionalidades:</span> <span className="font-bold">5%</span></li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: CONFIGURACIÓN */}
        {activeTab === 'config' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 uppercase font-display tracking-tight">Configuración del Sistema</h1>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Parámetros operativos del Paso Fronterizo Los Libertadores</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider font-display border-b pb-1.5">Límites y Alertas Sanitarias</h4>
              <div className="space-y-3 text-xs font-medium text-slate-600">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/20" />
                  <span>Activar bloqueo sanitario de cítricos procedentes de zona norte</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/20" />
                  <span>Habilitar alerta migratoria automática PDI (Interpol)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/20" />
                  <span>Sincronización horaria automática con servidores UTC Chile</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL: CREAR PERFIL */}
      {isCreateProfileOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full overflow-hidden">
            <div className="bg-[#004a99] text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-extrabold text-sm uppercase font-display tracking-wider">Crear Nuevo Perfil de Usuario</h3>
              <button 
                onClick={() => setIsCreateProfileOpen(false)} 
                className="text-white/80 hover:text-white p-1"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
              
              {/* Nombre Completo */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1" htmlFor="create-fullname">
                  Nombre Completo
                </label>
                <input
                  id="create-fullname"
                  type="text"
                  required
                  placeholder="Ej: Juan de Dios Alarcón"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#004a99] transition font-medium"
                />
              </div>

              {/* Correo Electrónico */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1" htmlFor="create-email">
                  Correo Electrónico
                </label>
                <input
                  id="create-email"
                  type="email"
                  required
                  placeholder="ejemplo@aduana.cl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#004a99] transition font-medium"
                />
              </div>

              {/* Contraseña */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1" htmlFor="create-password">
                  Contraseña
                </label>
                <input
                  id="create-password"
                  type="password"
                  required
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#004a99] transition font-medium"
                />
              </div>

              {/* Rol */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1" htmlFor="create-role">
                  Rol del Perfil
                </label>
                <select
                  id="create-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#004a99] transition font-medium bg-white"
                >
                  <option value="admin">Administrador</option>
                  <option value="aduana">Funcionario Aduana</option>
                  <option value="pdi">Funcionario PDI</option>
                  <option value="sag">Inspector SAG</option>
                  <option value="viajero">Viajero</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateProfileOpen(false)}
                  className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-2.5 px-4 rounded-lg border border-slate-200 transition text-[11px] uppercase tracking-wide cursor-pointer font-display"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-lg shadow-sm hover:shadow transition text-[11px] uppercase tracking-wide cursor-pointer font-display"
                >
                  Guardar perfil
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDITAR PERFIL */}
      {editingProfile && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full overflow-hidden">
            <div className="bg-[#004a99] text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-extrabold text-sm uppercase font-display tracking-wider font-display">Editar Perfil de Usuario</h3>
              <button 
                onClick={() => setEditingProfile(null)} 
                className="text-white/80 hover:text-white p-1"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="p-6 space-y-4">
              
              {/* Nombre Completo */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1" htmlFor="edit-fullname">
                  Nombre Completo
                </label>
                <input
                  id="edit-fullname"
                  type="text"
                  required
                  placeholder="Ej: Juan de Dios Alarcón"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#004a99] transition font-medium"
                />
              </div>

              {/* Correo Electrónico */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1" htmlFor="edit-email">
                  Correo Electrónico
                </label>
                <input
                  id="edit-email"
                  type="email"
                  required
                  placeholder="ejemplo@aduana.cl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#004a99] transition font-medium"
                />
              </div>

              {/* Rol */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1" htmlFor="edit-role">
                  Rol del Perfil
                </label>
                <select
                  id="edit-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#004a99] transition font-medium bg-white"
                >
                  <option value="admin">Administrador</option>
                  <option value="aduana">Funcionario Aduana</option>
                  <option value="pdi">Funcionario PDI</option>
                  <option value="sag">Inspector SAG</option>
                  <option value="viajero">Viajero</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingProfile(null)}
                  className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-2.5 px-4 rounded-lg border border-slate-200 transition text-[11px] uppercase tracking-wide cursor-pointer font-display"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-lg shadow-sm hover:shadow transition text-[11px] uppercase tracking-wide cursor-pointer font-display"
                >
                  Guardar cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
