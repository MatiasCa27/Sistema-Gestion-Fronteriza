/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, Fingerprint, Globe, Mail, Phone, Lock, CheckCircle, ArrowLeft } from 'lucide-react';
import { registerTraveler } from '../dbSim';
import { formatRut } from '../utils/formatters';

interface RegisterProps {
  onBackToLogin: () => void;
  onRegisterSuccess: () => void;
}

export default function Register({ onBackToLogin, onRegisterSuccess }: RegisterProps) {
  const [fullName, setFullName] = useState('');
  const [rutOrPassport, setRutOrPassport] = useState('');
  const [nationality, setNationality] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleRutBlur = () => {
    const clean = rutOrPassport.replace(/[^0-9kK]/g, '');
    if (clean.length >= 7 && clean.length <= 9) {
      setRutOrPassport(formatRut(rutOrPassport));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Field Validation
    if (!fullName || !rutOrPassport || !nationality || !email || !phone || !password || !confirmPassword) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    let formattedDoc = rutOrPassport.trim();
    const cleanDoc = formattedDoc.replace(/[^0-9kK]/g, '');
    if (cleanDoc.length >= 7 && cleanDoc.length <= 9) {
      formattedDoc = formatRut(formattedDoc);
    }

    const result = registerTraveler({
      fullName,
      rutOrPassport: formattedDoc,
      nationality,
      email,
      phone,
      password
    });

    if (result.success) {
      setIsSuccess(true);
      // Wait 2 seconds then navigate back or invoke success callback
      setTimeout(() => {
        onRegisterSuccess();
      }, 2500);
    } else {
      setError(result.error || 'Ocurrió un error en el registro.');
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-emerald-100 p-8 text-center space-y-4">
          <div className="mx-auto bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center border border-emerald-200">
            <CheckCircle className="w-10 h-10 text-emerald-600 animate-bounce" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">¡Registro Exitoso!</h2>
          <p className="text-emerald-700 font-medium">"Registro realizado correctamente".</p>
          <p className="text-sm text-gray-500 leading-relaxed pt-2">
            Su cuenta de viajero ha sido creada y asociada con un expediente de aduana inicial. Redirigiéndole al inicio de sesión...
          </p>
          <div className="pt-4">
            <div className="inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-4 py-8">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header decoration */}
        <div className="bg-[#004a99] px-6 py-6 text-white relative">
          <button
            type="button"
            onClick={onBackToLogin}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 hover:bg-blue-800 rounded-lg transition cursor-pointer"
            title="Volver al inicio de sesión"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="text-center">
            <h1 className="text-xl font-extrabold tracking-tight font-display uppercase">Registro de Viajero</h1>
            <p className="text-blue-100/90 text-xs mt-0.5 font-medium">Ingrese sus datos personales de viaje</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4" id="register-form">
          {error && (
            <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg">
              <span className="font-bold">Error:</span> {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre Completo */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1" htmlFor="reg-name">
                Nombre completo
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <User className="w-5 h-5" />
                </span>
                <input
                  id="reg-name"
                  type="text"
                  required
                  placeholder="Ej: Juan Ramón Pérez García"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition text-sm"
                />
              </div>
            </div>

            {/* Documento RUT o Pasaporte */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1" htmlFor="reg-rut">
                RUT o Pasaporte
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <Fingerprint className="w-5 h-5" />
                </span>
                <input
                  id="reg-rut"
                  type="text"
                  required
                  placeholder="Ej: 12.345.678-9 o G123456"
                  value={rutOrPassport}
                  onChange={(e) => setRutOrPassport(e.target.value)}
                  onBlur={handleRutBlur}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition text-sm"
                />
              </div>
            </div>

            {/* Nacionalidad */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1" htmlFor="reg-nat">
                Nacionalidad
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <Globe className="w-5 h-5" />
                </span>
                <input
                  id="reg-nat"
                  type="text"
                  required
                  placeholder="Ej: Chilena"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition text-sm"
                />
              </div>
            </div>

            {/* Correo Electrónico */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1" htmlFor="reg-email">
                Correo electrónico
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <Mail className="w-5 h-5" />
                </span>
                <input
                  id="reg-email"
                  type="email"
                  required
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition text-sm"
                />
              </div>
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1" htmlFor="reg-phone">
                Teléfono
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <Phone className="w-5 h-5" />
                </span>
                <input
                  id="reg-phone"
                  type="tel"
                  required
                  placeholder="Ej: +56912345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition text-sm"
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1" htmlFor="reg-pwd">
                Contraseña
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  id="reg-pwd"
                  type="password"
                  required
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition text-sm"
                />
              </div>
            </div>

            {/* Confirmar Contraseña */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1" htmlFor="reg-pwd-conf">
                Confirmar contraseña
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  id="reg-pwd-conf"
                  type="password"
                  required
                  placeholder="Repita la contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#004a99] transition text-sm font-medium"
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              id="btn-create-account"
              className="w-full bg-[#004a99] hover:bg-[#003d80] text-white font-bold py-3 px-4 rounded-lg shadow transition duration-200 flex items-center justify-center cursor-pointer font-display uppercase tracking-wide text-sm"
            >
              Crear cuenta
            </button>
          </div>

          <p className="text-center text-xs text-gray-500 pt-2 font-medium">
            ¿Ya tiene una cuenta?{' '}
            <button
              type="button"
              onClick={onBackToLogin}
              className="text-[#004a99] hover:underline font-bold"
            >
              Inicie sesión aquí
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
