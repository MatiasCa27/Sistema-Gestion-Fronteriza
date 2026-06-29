/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Car, 
  HelpCircle,
  FileText,
  BadgeAlert,
  MapPin,
  ClipboardList
} from 'lucide-react';
import { Tramite } from '../types';
import { formatDocument } from '../utils/formatters';

interface CustomsOfficerPanelProps {
  tramites: Tramite[];
  onUpdateTramite: (tramite: Tramite) => void;
}

export default function CustomsOfficerPanel({ tramites, onUpdateTramite }: CustomsOfficerPanelProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterState, setFilterState] = useState<'Todos' | 'Revisión Aduana' | 'Autorizado' | 'Rechazado'>('Todos');

  // Decision inputs state
  const [actionType, setActionType] = useState<'rechazo' | 'adicional' | null>(null);
  const [actionTramiteId, setActionTramiteId] = useState<string | null>(null);
  const [decisionReason, setDecisionReason] = useState('');

  // Filter out cases. Customs officers review dossiers that have completed basic forms
  const filteredTramites = tramites.filter(t => {
    const matchesSearch = 
      t.travelerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      t.travelerRut.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.vehicle.registered && t.vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()));

    const isReadyForCustoms = t.pdi.completed && t.sag.completed;
    const matchesFilter = filterState === 'Todos' || t.status === filterState;

    return isReadyForCustoms && matchesSearch && matchesFilter;
  });

  const handleAuthorize = (tramite: Tramite) => {
    const updated: Tramite = {
      ...tramite,
      status: 'Autorizado',
      docsStatus: 'Completa',
      finalDecisionReason: 'Ingreso autorizado. Documentación nacional e internacional verificada correctamente, sin observaciones fitosanitarias pendientes. ¡Bienvenido al país!'
    };
    onUpdateTramite(updated);
  };

  const handleInitiateAction = (id: string, type: 'rechazo' | 'adicional') => {
    setActionTramiteId(id);
    setActionType(type);
    setDecisionReason('');
  };

  const handleConfirmActionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionTramiteId || !actionType) return;

    const target = tramites.find(t => t.id === actionTramiteId);
    if (target) {
      if (actionType === 'rechazo') {
        const updated: Tramite = {
          ...target,
          status: 'Rechazado',
          finalDecisionReason: decisionReason || 'Ingreso rechazado por resolución discrecional de la autoridad aduanera.'
        };
        onUpdateTramite(updated);
      } else {
        // Solicitar revisión adicional
        const updated: Tramite = {
          ...target,
          status: 'Revisión SAG', // send back to SAG or pending queue
          docsStatus: 'Pendiente de revisión',
          finalDecisionReason: `Revisión adicional solicitada: ${decisionReason}`
        };
        onUpdateTramite(updated);
      }
    }

    setActionTramiteId(null);
    setActionType(null);
    setDecisionReason('');
  };

  return (
    <div className="space-y-6 py-6 px-4 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-[#004a99] text-white p-3 rounded-xl shadow-md shadow-blue-800/10">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 font-display uppercase tracking-tight">Panel de Aduanas</h1>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Administración General Aduanera y Control Fronterizo Integrado</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 self-start text-[10px] font-bold text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full font-display uppercase tracking-wide">
          <MapPin className="w-3.5 h-3.5 text-[#004a99]" />
          <span>Garita Central de Control Aduanero</span>
        </div>
      </div>

      {/* Decision modal for rejection / additional review */}
      {actionTramiteId && actionType && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-200 overflow-hidden animate-fade-in">
            <div className={`p-4 flex items-center gap-2 text-white ${actionType === 'rechazo' ? 'bg-red-700' : 'bg-blue-700'}`}>
              <BadgeAlert className="w-5 h-5" />
              <h2 className="font-bold text-sm">
                {actionType === 'rechazo' ? 'Rechazar Ingreso al País' : 'Solicitar Revisión Adicional'}
              </h2>
            </div>
            <form onSubmit={handleConfirmActionSubmit} className="p-5 space-y-4">
              <p className="text-xs text-gray-600 leading-relaxed">
                {actionType === 'rechazo' 
                  ? 'Escriba de forma clara y formal el motivo de rechazo de ingreso para el viajero. Este mensaje se mostrará directamente en su pantalla de estado:' 
                  : 'Describa qué documentos o inspecciones requieren verificación adicional por el personal de campo:'}
              </p>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1" htmlFor="action-reason-input">
                  Motivo o Requerimiento
                </label>
                <textarea
                  id="action-reason-input"
                  rows={4}
                  required
                  placeholder={actionType === 'rechazo' ? 'Ej: Se rechaza ingreso por portar patentes automotrices adulteradas y discrepancia crítica en documentación de identidad...' : 'Ej: Solicitar pesaje de carga vehicular y escaneo de rayos x por bulto sospechoso...'}
                  value={decisionReason}
                  onChange={(e) => setDecisionReason(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                ></textarea>
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => { setActionTramiteId(null); setActionType(null); }}
                  className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg border transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-white text-xs font-semibold rounded-lg shadow transition cursor-pointer ${actionType === 'rechazo' ? 'bg-red-700 hover:bg-red-800' : 'bg-blue-700 hover:bg-blue-800'}`}
                >
                  {actionType === 'rechazo' ? 'Confirmar Rechazo' : 'Solicitar Revisión'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grid Table Controller */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por viajero, RUT o Patente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#004a99] transition font-medium"
            />
          </div>

          {/* Status filters */}
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 shrink-0 font-display">
              <ClipboardList className="w-3.5 h-3.5 text-[#004a99]" /> Estado:
            </span>
            <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs">
              {(['Todos', 'Revisión Aduana', 'Autorizado', 'Rechazado'] as const).map((state) => (
                <button
                  key={state}
                  type="button"
                  onClick={() => setFilterState(state)}
                  className={`px-3 py-1 font-bold rounded-md transition duration-150 cursor-pointer ${filterState === state ? 'bg-[#004a99] text-white shadow-xs' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {state === 'Revisión Aduana' ? '⌛ En Revisión' : state}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Big Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 font-display">
                <th className="py-3.5 px-6">Nombre del viajero</th>
                <th className="py-3.5 px-6">Estado Documentos</th>
                <th className="py-3.5 px-6">Declaración SAG</th>
                <th className="py-3.5 px-6">Declaración PDI</th>
                <th className="py-3.5 px-6">Vehículo</th>
                <th className="py-3.5 px-6 text-center">Resolución Aduana</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 text-xs font-medium">
              {filteredTramites.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 px-6 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <FileText className="w-8 h-8 text-gray-300" />
                      <p className="font-medium text-sm">No hay trámites que requieran atención de aduanas actualmente.</p>
                      <p className="text-xs">Los expedientes deben completar primero las declaraciones de Viajero y la inspección del SAG.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTramites.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50/50 transition">
                    
                    {/* Traveler identity */}
                    <td className="py-4 px-6">
                      <p className="font-bold text-gray-800">{t.travelerName}</p>
                      <div className="flex flex-col gap-0.5 mt-0.5 text-[10px] text-gray-400">
                        <span className="font-mono">{t.travelerRut}</span>
                        <span>{t.travelerNationality} • {t.travelerPhone}</span>
                      </div>
                    </td>

                    {/* General Docs state */}
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          t.status === 'Autorizado' ? 'bg-emerald-50 text-emerald-700' :
                          t.status === 'Rechazado' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {t.status === 'Autorizado' ? 'APROBADO' : t.status === 'Rechazado' ? 'RECHAZADO' : 'PENDIENTE'}
                        </span>
                        <p className="text-[10px] text-gray-400 font-medium">Documentación completa</p>
                      </div>
                    </td>

                    {/* SAG Health state */}
                    <td className="py-4 px-6">
                      {t.sag.status === 'Aprobado' ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded text-[10px]">
                          ✔ APROBADO
                        </span>
                      ) : t.sag.status === 'Retenido' ? (
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 font-bold px-1.5 py-0.5 rounded text-[10px]">
                            ⚠️ CON RETENCIÓN
                          </span>
                          <p className="text-[9px] text-gray-500 font-sans line-clamp-1 italic">
                            {t.sag.comments}
                          </p>
                        </div>
                      ) : t.sag.status === 'Rechazado' ? (
                        <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 font-bold px-1.5 py-0.5 rounded text-[10px]">
                          ✖ RECHAZADO
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 font-bold px-1.5 py-0.5 rounded text-[10px]">
                          ⌛ EN REVISIÓN SAG
                        </span>
                      )}
                    </td>

                    {/* PDI migration data */}
                    <td className="py-4 px-6">
                      <div className="space-y-0.5 text-[10px] text-gray-600">
                        <p><span className="font-medium text-gray-400">Origen:</span> {t.pdi.originCountry}</p>
                        <p><span className="font-medium text-gray-400">Motivo:</span> {t.pdi.travelReason}</p>
                        <p><span className="font-medium text-gray-400">Estadía:</span> {t.pdi.stayDays} días</p>
                        <p className="font-mono text-gray-500">{t.pdi.docType}: {formatDocument(t.pdi.docType, t.pdi.docNumber)}</p>
                      </div>
                    </td>

                    {/* Vehicle description */}
                    <td className="py-4 px-6">
                      {t.vehicle.registered ? (
                        <div className="space-y-0.5 text-[10px] text-gray-600">
                          <p className="font-mono bg-slate-100 text-gray-800 font-bold px-1 py-0.2 rounded border w-fit">{t.vehicle.plate}</p>
                          <p className="font-medium">{t.vehicle.brand} {t.vehicle.model}</p>
                          <p className="text-gray-400">{t.vehicle.color} ({t.vehicle.year})</p>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">Ingreso Peatonal</span>
                      )}
                    </td>

                    {/* Customs decisions action buttons */}
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1.5 max-w-[150px] mx-auto">
                        <button
                          type="button"
                          onClick={() => handleAuthorize(t)}
                          disabled={t.status === 'Autorizado'}
                          className="w-full bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 disabled:opacity-40 disabled:hover:bg-emerald-50 disabled:hover:text-emerald-700 py-1.5 px-2 rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Autorizar ingreso
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => handleInitiateAction(t.id, 'rechazo')}
                          disabled={t.status === 'Rechazado'}
                          className="w-full bg-red-50 hover:bg-red-600 text-red-700 hover:text-white border border-red-200 disabled:opacity-40 disabled:hover:bg-red-50 disabled:hover:text-red-700 py-1.5 px-2 rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Rechazar ingreso
                        </button>

                        <button
                          type="button"
                          onClick={() => handleInitiateAction(t.id, 'adicional')}
                          disabled={t.status === 'Rechazado' || t.status === 'Autorizado'}
                          className="w-full bg-gray-50 hover:bg-slate-600 text-gray-700 hover:text-white border border-gray-200 disabled:opacity-40 disabled:hover:bg-gray-50 disabled:hover:text-gray-700 py-1.5 px-2 rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <HelpCircle className="w-3.5 h-3.5" /> Revisión adicional
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Control rules info */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex gap-3 text-xs text-slate-600">
        <Clock className="w-4.5 h-4.5 text-[#004a99] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-slate-800 uppercase tracking-wide font-display text-[11px] flex items-center gap-1">📌 Directriz de Trabajo Aduanero:</p>
          <p className="leading-relaxed">
            Antes de <strong className="text-slate-850">Autorizar ingreso</strong>, verifique si la declaración SAG posee observaciones preventivas de mercancía retenida. En caso de mercancías decomisadas u objeciones críticas de identidad de la PDI, proceda a presionar <strong className="text-slate-850">Rechazar ingreso</strong> con la fundamentación correspondiente.
          </p>
        </div>
      </div>
    </div>
  );
}
