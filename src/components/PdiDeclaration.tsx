/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserSquare2, CheckCircle2, ArrowLeft, Landmark } from 'lucide-react';
import { Tramite } from '../types';

interface PdiDeclarationProps {
  tramite: Tramite;
  onSave: (pdiData: Tramite['pdi']) => void;
  onBack: () => void;
}

export default function PdiDeclaration({ tramite, onSave, onBack }: PdiDeclarationProps) {
  const [originCountry, setOriginCountry] = useState(tramite.pdi.originCountry || '');
  const [destinationCountry, setDestinationCountry] = useState(tramite.pdi.destinationCountry || 'Chile');
  const [travelReason, setTravelReason] = useState(tramite.pdi.travelReason || 'Turismo');
  const [stayDays, setStayDays] = useState(tramite.pdi.stayDays || '');
  const [docType, setDocType] = useState<Tramite['pdi']['docType']>(tramite.pdi.docType || 'RUT');
  const [docNumber, setDocNumber] = useState(tramite.pdi.docNumber || tramite.travelerRut || '');

  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!originCountry.trim()) {
      setError('Por favor indique el país de origen.');
      return;
    }
    if (!destinationCountry.trim()) {
      setError('Por favor indique el país de destino.');
      return;
    }
    if (!stayDays.trim() || isNaN(Number(stayDays)) || Number(stayDays) <= 0) {
      setError('Por favor ingrese un tiempo de permanencia válido en días (ej: 15).');
      return;
    }
    if (!docNumber.trim()) {
      setError('Por favor ingrese el número de documento de identidad.');
      return;
    }

    const updatedPdi: Tramite['pdi'] = {
      completed: true,
      originCountry,
      destinationCountry,
      travelReason,
      stayDays,
      docType,
      docNumber
    };

    onSave(updatedPdi);
    setShowSuccess(true);
    
    setTimeout(() => {
      onBack();
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      {/* Navigation and Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="p-2.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-display uppercase tracking-tight">Declaración de Control PDI</h1>
          <p className="text-slate-500 text-xs font-semibold tracking-wider uppercase">Policía de Investigaciones de Chile - Control Migratorio</p>
        </div>
      </div>

      {showSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 animate-fade-in" id="success-pdi-alert">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          <div>
            <p className="font-bold">Declaración guardada correctamente.</p>
            <p className="text-sm text-emerald-700/95">Los datos migratorios han sido registrados con éxito.</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Decorative Badge */}
        <div className="bg-[#004a99] px-6 py-4 text-white flex items-center gap-3">
          <div className="bg-white/10 p-2 rounded-lg">
            <Landmark className="w-6 h-6 text-blue-100" />
          </div>
          <div>
            <h2 className="font-bold text-sm font-display uppercase tracking-wider">Formulario de Ingreso Migratorio</h2>
            <p className="text-xs text-blue-100/90 font-medium">Control de identidad y permanencia de extranjeros y residentes</p>
          </div>
        </div>

        <form onSubmit={handleFormSubmit} className="p-6 space-y-5" id="pdi-form">
          {error && (
            <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg">
              <span className="font-bold">Error:</span> {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pais de Origen */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1" htmlFor="pdi-origin">
                País de origen
              </label>
              <input
                id="pdi-origin"
                type="text"
                required
                placeholder="Ej: Argentina, Brasil, Perú..."
                value={originCountry}
                onChange={(e) => setOriginCountry(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#004a99] transition font-medium"
              />
            </div>

            {/* Pais de Destino */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1" htmlFor="pdi-dest">
                País de destino
              </label>
              <input
                id="pdi-dest"
                type="text"
                required
                placeholder="Ej: Chile"
                value={destinationCountry}
                onChange={(e) => setDestinationCountry(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#004a99] transition font-medium"
              />
            </div>

            {/* Motivo del viaje */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1" htmlFor="pdi-reason">
                Motivo del viaje
              </label>
              <select
                id="pdi-reason"
                value={travelReason}
                onChange={(e) => setTravelReason(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#004a99] transition font-medium bg-white"
              >
                <option value="Turismo">Turismo / Recreación</option>
                <option value="Trabajo">Negocios / Trabajo Temporal</option>
                <option value="Estudios">Estudios / Intercambio</option>
                <option value="Residencia">Tránsito / Retorno al país</option>
                <option value="Salud">Salud / Tratamiento Médico</option>
              </select>
            </div>

            {/* Tiempo de permanencia */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1" htmlFor="pdi-stay">
                Tiempo de permanencia (Días)
              </label>
              <input
                id="pdi-stay"
                type="number"
                required
                min="1"
                max="365"
                placeholder="Ej: 15"
                value={stayDays}
                onChange={(e) => setStayDays(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#004a99] transition font-medium"
              />
            </div>

            {/* Tipo de Documento de Identidad */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1" htmlFor="pdi-doctype">
                Tipo de documento de identidad
              </label>
              <select
                id="pdi-doctype"
                value={docType}
                onChange={(e) => setDocType(e.target.value as Tramite['pdi']['docType'])}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#004a99] transition font-medium bg-white"
              >
                <option value="RUT">RUT Chileno</option>
                <option value="Pasaporte">Pasaporte Internacional</option>
                <option value="DNI">DNI Mercosur</option>
              </select>
            </div>

            {/* Número de Documento */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1" htmlFor="pdi-docnum">
                Número de documento
              </label>
              <input
                id="pdi-docnum"
                type="text"
                required
                placeholder="Ej: 12345678-9 o número de pasaporte"
                value={docNumber}
                onChange={(e) => setDocNumber(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#004a99] transition font-medium"
              />
            </div>
          </div>

          {/* Submit and cancel buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onBack}
              className="w-full sm:w-1/3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-3.5 px-4 rounded-lg border border-slate-250 transition text-xs uppercase tracking-wide cursor-pointer font-display"
            >
              Volver al menú
            </button>
            <button
              type="submit"
              id="btn-save-pdi"
              className="w-full sm:w-2/3 bg-[#004a99] hover:bg-[#003d80] text-white font-bold py-3.5 px-4 rounded-lg shadow-sm hover:shadow transition text-xs uppercase tracking-wide cursor-pointer font-display flex items-center justify-center gap-2"
            >
              <UserSquare2 className="w-4 h-4" /> Guardar declaración
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
