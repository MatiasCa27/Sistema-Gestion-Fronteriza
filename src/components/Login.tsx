/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, CheckCircle, Info, ChevronRight } from 'lucide-react';
import { TravelerProfile, UserRole } from '../types';
import { getTravelers, getProfiles } from '../dbSim';

interface LoginProps {
  onLogin: (role: UserRole, userProfile?: TravelerProfile) => void;
  onNavigateToRegister: () => void;
}

export default function Login({ onLogin, onNavigateToRegister }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [recoveryMessage, setRecoveryMessage] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setRecoveryMessage('');

    if (!email || !password) {
      setError('Por favor, complete todos los campos.');
      return;
    }

    // Check dynamic profiles from database first (includes admin, pdi, sag, aduana, and any created profiles)
    const profiles = getProfiles();
    const systemProfile = profiles.find(p => p.email.toLowerCase() === email.toLowerCase());

    if (systemProfile) {
      if (systemProfile.status === 'Inactivo') {
        setError('Este perfil se encuentra inactivo. Contacte al administrador.');
        return;
      }
      if (systemProfile.password === password || password === 'password123') {
        onLogin(systemProfile.role);
        return;
      } else {
        setError('Contraseña incorrecta.');
        return;
      }
    }

    // Fallbacks for hardcoded accounts
    if (email.toLowerCase() === 'inspector.sag@aduana.gob.cl' || email.toLowerCase() === 'sag@aduana.cl') {
      onLogin('sag');
      return;
    }
    if (email.toLowerCase() === 'funcionario.aduana@aduana.gob.cl' || email.toLowerCase() === 'aduana@aduana.cl') {
      onLogin('aduana');
      return;
    }
    if (email.toLowerCase() === 'funcionario.pdi@pdi.cl' || email.toLowerCase() === 'pdi@pdi.cl') {
      onLogin('pdi');
      return;
    }
    if (email.toLowerCase() === 'admin@aduana.cl') {
      onLogin('admin');
      return;
    }

    // Check Travelers in simulated database
    const travelers = getTravelers();
    const user = travelers.find(t => t.email.toLowerCase() === email.toLowerCase());

    if (user) {
      // Allow standard logins or password123
      if (user.password === password || password === 'password123') {
        onLogin('viajero', user);
      } else {
        setError('Contraseña incorrecta.');
      }
    } else {
      setError('Usuario no registrado. Si es funcionario, use las cuentas de demostración indicadas abajo o registre una en el panel administrador.');
    }
  };

  const handleForgotPassword = () => {
    if (!email) {
      setError('Ingrese su correo electrónico en el campo superior para recuperar su contraseña.');
      setRecoveryMessage('');
      return;
    }
    setError('');
    setRecoveryMessage(`Se ha enviado un correo de recuperación a: ${email}`);
  };

  const loginWithDemo = (demoRole: UserRole, demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
    setError('');
    setRecoveryMessage('');
    
    if (demoRole === 'viajero') {
      const travelers = getTravelers();
      const user = travelers.find(t => t.email === demoEmail) || travelers[1]; // María Silva as default
      onLogin('viajero', user);
    } else {
      onLogin(demoRole);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden" id="login-card">
        {/* Header decoration */}
        <div className="bg-[#004a99] px-6 py-8 text-center text-white relative">
          <div className="absolute top-4 right-4 bg-white/10 text-blue-100 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border border-white/20 font-display">
            Paso Fronterizo
          </div>
          <div className="flex justify-center mb-3">
            <div className="bg-white/10 p-3 rounded-full border border-white/20">
              <ShieldCheck className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight font-display uppercase">Sistema de Gestión</h1>
          <p className="text-blue-100/90 text-sm mt-1 font-medium">Control Fronterizo Integrado</p>
        </div>

        <form onSubmit={handleLogin} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg flex items-start gap-2">
              <span className="font-bold">Error:</span> {error}
            </div>
          )}

          {recoveryMessage && (
            <div className="p-3 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 text-sm rounded-r-lg flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{recoveryMessage}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1" htmlFor="email-input">
              Correo Electrónico
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <Mail className="w-5 h-5" />
              </span>
              <input
                id="email-input"
                type="email"
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#004a99] transition font-medium"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider" htmlFor="password-input">
                Contraseña
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-xs text-[#004a99] hover:underline font-bold"
                id="btn-recover-pw"
              >
                ¿Olvidó su contraseña?
              </button>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <Lock className="w-5 h-5" />
              </span>
              <input
                id="password-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#004a99] transition font-medium"
              />
            </div>
          </div>

          <div className="pt-2 space-y-3">
            <button
              type="submit"
              id="btn-login"
              className="w-full bg-[#004a99] hover:bg-[#003d80] text-white font-bold py-3 px-4 rounded-lg shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer font-display uppercase tracking-wide text-xs"
            >
              Iniciar Sesión
            </button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-4 text-slate-400 text-[10px] uppercase tracking-wider font-bold font-display">¿No tiene cuenta?</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <button
              type="button"
              id="btn-goto-register"
              onClick={onNavigateToRegister}
              className="w-full bg-slate-50 hover:bg-slate-100 text-[#004a99] border border-slate-250 font-bold py-3 px-4 rounded-lg transition font-display uppercase tracking-wide text-xs cursor-pointer"
            >
              Registrarse como Viajero
            </button>
          </div>
        </form>

        {/* Demo Fast Access Block */}
        <div className="bg-slate-50 border-t border-slate-200 p-5 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wide font-display">
            <Info className="w-4 h-4 text-[#004a99]" />
            <span>Acceso rápido de demostración</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            Haga clic en cualquiera de estas cuentas para iniciar sesión automáticamente y probar los diferentes roles y pantallas del sistema:
          </p>
          <div className="grid grid-cols-1 gap-2 pt-1">
            <button
              type="button"
              onClick={() => loginWithDemo('viajero', 'maria.silva@email.com')}
              className="flex items-center justify-between bg-white hover:bg-blue-50/30 p-2.5 rounded-lg border border-slate-200 hover:border-[#004a99] text-left transition group text-xs text-slate-700 cursor-pointer"
            >
              <div>
                <span className="font-bold block text-slate-800">1. Viajero: María Silva</span>
                <span className="text-slate-400 font-mono font-bold text-[10px]">{`maria.silva@email.com`}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#004a99] transition" />
            </button>

            <button
              type="button"
              onClick={() => loginWithDemo('sag', 'sag@aduana.cl')}
              className="flex items-center justify-between bg-white hover:bg-blue-50/30 p-2.5 rounded-lg border border-slate-200 hover:border-[#004a99] text-left transition group text-xs text-slate-700 cursor-pointer"
            >
              <div>
                <span className="font-bold block text-slate-800 font-display">2. Inspector SAG</span>
                <span className="text-slate-400 font-mono font-bold text-[10px]">{`sag@aduana.cl`}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#004a99] transition" />
            </button>

            <button
              type="button"
              onClick={() => loginWithDemo('aduana', 'aduana@aduana.cl')}
              className="flex items-center justify-between bg-white hover:bg-blue-50/30 p-2.5 rounded-lg border border-slate-200 hover:border-[#004a99] text-left transition group text-xs text-slate-700 cursor-pointer"
            >
              <div>
                <span className="font-bold block text-slate-800 font-display">3. Funcionario de Aduana</span>
                <span className="text-slate-400 font-mono font-bold text-[10px]">{`aduana@aduana.cl`}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#004a99] transition" />
            </button>

            <button
              type="button"
              onClick={() => loginWithDemo('pdi', 'claudio.pdi@pdi.cl')}
              className="flex items-center justify-between bg-white hover:bg-blue-50/30 p-2.5 rounded-lg border border-slate-200 hover:border-[#004a99] text-left transition group text-xs text-slate-700 cursor-pointer"
            >
              <div>
                <span className="font-bold block text-slate-800 font-display">4. Funcionario PDI (Migración)</span>
                <span className="text-slate-400 font-mono font-bold text-[10px]">{`claudio.pdi@pdi.cl`}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#004a99] transition" />
            </button>

            <button
              type="button"
              onClick={() => loginWithDemo('admin', 'admin@aduana.cl')}
              className="flex items-center justify-between bg-white hover:bg-blue-50/30 p-2.5 rounded-lg border border-slate-200 hover:border-[#004a99] text-left transition group text-xs text-slate-700 cursor-pointer"
            >
              <div>
                <span className="font-bold block text-slate-800 font-display">5. Administrador del Sistema</span>
                <span className="text-slate-400 font-mono font-bold text-[10px]">{`admin@aduana.cl`}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#004a99] transition" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
