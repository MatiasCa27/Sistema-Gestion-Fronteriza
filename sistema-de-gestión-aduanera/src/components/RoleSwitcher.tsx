/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Users, 
  Sprout, 
  ShieldAlert, 
  UserSquare2, 
  RefreshCw, 
  Settings,
  HelpCircle,
  Fingerprint,
  ShieldCheck
} from 'lucide-react';
import { UserRole, TravelerProfile } from '../types';

interface RoleSwitcherProps {
  currentRole: UserRole;
  currentTraveler: TravelerProfile | null;
  allTravelers: TravelerProfile[];
  onSwitchRole: (role: UserRole, traveler?: TravelerProfile) => void;
  onResetDatabase: () => void;
}

export default function RoleSwitcher({ 
  currentRole, 
  currentTraveler, 
  allTravelers, 
  onSwitchRole, 
  onResetDatabase 
}: RoleSwitcherProps) {
  
  return (
    <div className="bg-slate-900 text-slate-200 border-b border-slate-800 text-xs px-4 py-3 sticky top-0 z-40" id="role-switcher-bar">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Left side: branding/alert */}
        <div className="flex items-center gap-2">
          <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">PROTOTIPO</span>
          <p className="font-semibold text-slate-100 flex items-center gap-1">
            <span>Sistema Aduanero de Frontera</span>
            <span className="text-slate-500 font-normal">| Simulador de Roles de Flujo</span>
          </p>
        </div>

        {/* Center: Buttons to switch */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px] shrink-0">Simular Rol:</span>
          
          {/* Viajero switch */}
          <div className="flex items-center bg-slate-850 border border-slate-750 rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => onSwitchRole('viajero', currentTraveler || allTravelers[1])}
              className={`px-2.5 py-1 rounded font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                currentRole === 'viajero' 
                  ? 'bg-blue-600 text-white shadow' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" /> Viajero
            </button>

            {currentRole === 'viajero' && (
              <select
                aria-label="Seleccionar Viajero para simulación"
                value={currentTraveler?.id || ''}
                onChange={(e) => {
                  const targetUser = allTravelers.find(t => t.id === e.target.value);
                  if (targetUser) {
                    onSwitchRole('viajero', targetUser);
                  }
                }}
                className="bg-transparent text-slate-300 font-semibold border-l border-slate-750 pl-1.5 pr-1 py-0.5 max-w-[120px] focus:outline-none"
              >
                {allTravelers.map(t => (
                  <option key={t.id} value={t.id} className="bg-slate-900 text-slate-300">
                    {t.fullName.split(' ')[0]} ({t.rutOrPassport.slice(-5)})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* SAG Switch */}
          <button
            type="button"
            onClick={() => onSwitchRole('sag')}
            className={`px-3 py-1.5 rounded-lg border font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              currentRole === 'sag' 
                ? 'bg-emerald-600 border-emerald-500 text-white' 
                : 'bg-slate-850 border-slate-750 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sprout className="w-3.5 h-3.5" /> Inspector SAG
          </button>

          {/* Aduana Switch */}
          <button
            type="button"
            onClick={() => onSwitchRole('aduana')}
            className={`px-3 py-1.5 rounded-lg border font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              currentRole === 'aduana' 
                ? 'bg-sky-600 border-sky-500 text-white' 
                : 'bg-slate-850 border-slate-750 text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserSquare2 className="w-3.5 h-3.5" /> Funcionario Aduana
          </button>

          {/* PDI Switch */}
          <button
            type="button"
            onClick={() => onSwitchRole('pdi')}
            className={`px-3 py-1.5 rounded-lg border font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              currentRole === 'pdi' 
                ? 'bg-indigo-600 border-indigo-500 text-white' 
                : 'bg-slate-850 border-slate-750 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Fingerprint className="w-3.5 h-3.5" /> Funcionario PDI
          </button>

          {/* Admin Switch */}
          <button
            type="button"
            onClick={() => onSwitchRole('admin')}
            className={`px-3 py-1.5 rounded-lg border font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              currentRole === 'admin' 
                ? 'bg-slate-700 border-slate-600 text-white' 
                : 'bg-slate-850 border-slate-750 text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Administrador
          </button>
        </div>

        {/* Right side: Database actions */}
        <div className="flex items-center gap-2 self-end md:self-auto pt-1 md:pt-0">
          <button
            type="button"
            onClick={onResetDatabase}
            className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-red-400 bg-slate-850 hover:bg-slate-800 border border-slate-750 hover:border-red-500/30 px-2.5 py-1.5 rounded-lg transition cursor-pointer"
            title="Restablece los datos ficticios originales en localStorage"
          >
            <RefreshCw className="w-3 h-3" /> Reiniciar Datos
          </button>
        </div>
      </div>
    </div>
  );
}
