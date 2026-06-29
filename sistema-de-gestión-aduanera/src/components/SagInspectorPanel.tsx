/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Sprout, 
  Search, 
  Check, 
  X, 
  Archive, 
  AlertTriangle, 
  FileText,
  ShieldAlert,
  MapPin,
  Clock,
  Filter
} from 'lucide-react';
import { Tramite } from '../types';

interface SagInspectorPanelProps {
  tramites: Tramite[];
  onUpdateTramite: (tramite: Tramite) => void;
}

export default function SagInspectorPanel({ tramites, onUpdateTramite }: SagInspectorPanelProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'Todos' | 'Pendiente' | 'Aprobado' | 'Rechazado' | 'Retenido'>('Todos');
  
  // States for handling retention notes
  const [retentionId, setRetentionId] = useState<string | null>(null);
  const [retentionNotes, setRetentionNotes] = useState('');

  // Process and filter dossiers
  const filteredTramites = tramites.filter(t => {
    const matchesSearch = 
      t.travelerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      t.travelerRut.toLowerCase().includes(searchTerm.toLowerCase());
    
    // In the SAG view, we only show those who have completed their SAG form
    const hasCompletedSag = t.sag.completed;
    
    const matchesFilter = filterStatus === 'Todos' || t.sag.status === filterStatus;

    return hasCompletedSag && matchesSearch && matchesFilter;
  });

  const handleApprove = (tramite: Tramite) => {
    const updated: Tramite = {
      ...tramite,
      sag: {
        ...tramite.sag,
        status: 'Aprobado',
        comments: 'Declaración aprobada por el inspector SAG. Libre de riesgo sanitario vegetal/animal.'
      },
      status: tramite.status === 'Revisión SAG' ? 'Revisión Aduana' : tramite.status,
      docsStatus: 'Declaración aprobada'
    };
    onUpdateTramite(updated);
  };

  const handleReject = (tramite: Tramite) => {
    const updated: Tramite = {
      ...tramite,
      sag: {
        ...tramite.sag,
        status: 'Rechazado',
        comments: 'Declaración rechazada. Se detectó transporte de productos biológicos prohibidos y no declarados adecuadamente.'
      },
      status: 'Rechazado',
      docsStatus: 'Faltan documentos',
      finalDecisionReason: 'Ingreso denegado debido al rechazo sanitario de la declaración SAG por presencia de patógenos o mercancías prohibidas sin autorización previa.'
    };
    onUpdateTramite(updated);
  };

  const handleInitiateRetention = (id: string) => {
    setRetentionId(id);
    setRetentionNotes('');
  };

  const handleConfirmRetention = (e: React.FormEvent) => {
    e.preventDefault();
    if (!retentionId || !retentionNotes.trim()) return;

    const targetTramite = tramites.find(t => t.id === retentionId);
    if (targetTramite) {
      const updated: Tramite = {
        ...targetTramite,
        sag: {
          ...targetTramite.sag,
          status: 'Retenido',
          comments: retentionNotes
        },
        // We route them to Revision Aduana so the Customs agent can decide if they enter or not despite the SAG retention (e.g. they pay the fine, destroy the apples, and proceed!)
        status: targetTramite.status === 'Revisión SAG' ? 'Revisión Aduana' : targetTramite.status,
        docsStatus: 'Completa'
      };
      onUpdateTramite(updated);
    }

    setRetentionId(null);
    setRetentionNotes('');
  };

  const getProductsSummary = (t: Tramite) => {
    const summary: string[] = [];
    if (t.sag.hasVegetables) summary.push(`[Veg] ${t.sag.vegetablesDesc}`);
    if (t.sag.hasAnimals) summary.push(`[Anim] ${t.sag.animalsDesc}`);
    if (t.sag.hasFood) summary.push(`[Alim] ${t.sag.foodDesc}`);
    if (t.sag.hasPets) summary.push(`[Mascota] ${t.sag.petsDesc}`);

    return summary.length > 0 ? summary.join(' | ') : 'Negativa (Ningún producto declarado)';
  };

  return (
    <div className="space-y-6 py-6 px-4 max-w-6xl mx-auto">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-[#004a99] text-white p-3 rounded-xl shadow-md shadow-blue-500/10">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 font-display uppercase tracking-tight">Panel del Inspector SAG</h1>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Inspección de Sanidad Silvoagropecuaria - Paso Los Libertadores</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 self-start text-[10px] font-bold text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full font-display uppercase tracking-wide">
          <MapPin className="w-3.5 h-3.5 text-[#004a99]" />
          <span>Estación de Inspección SAG</span>
        </div>
      </div>

      {/* Retention Observation Dialog (Modal Overlay) */}
      {retentionId && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-amber-200 overflow-hidden animate-fade-in">
            <div className="bg-amber-600 text-white p-4 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5" />
              <h2 className="font-bold text-sm">Retención de Mercancías Prohibidas</h2>
            </div>
            <form onSubmit={handleConfirmRetention} className="p-5 space-y-4">
              <p className="text-xs text-gray-600 leading-relaxed">
                Escriba las observaciones del acta de retención del SAG. Indique qué productos específicos se retendrán en el depósito fronterizo y el motivo fitosanitario:
              </p>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1" htmlFor="obs-desc">
                  Observaciones de la Retención
                </label>
                <textarea
                  id="obs-desc"
                  rows={4}
                  required
                  placeholder="Ej: Retención preventiva de manzanas por carecer de certificación de origen y riesgo de mosca de la fruta. Se depositan en bodega..."
                  value={retentionNotes}
                  onChange={(e) => setRetentionNotes(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 font-sans"
                ></textarea>
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setRetentionId(null)}
                  className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg border transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow transition cursor-pointer"
                >
                  Registrar Retención
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table controls */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar viajero por nombre o RUT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#004a99] transition font-medium"
            />
          </div>

          {/* Status filters */}
          <div className="flex items-center gap-2 self-stretch md:self-auto overflow-x-auto py-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1.5 shrink-0 font-display">
              <Filter className="w-3.5 h-3.5 text-[#004a99]" /> Filtrar estado:
            </span>
            <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs">
              {(['Todos', 'Pendiente', 'Aprobado', 'Rechazado', 'Retenido'] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1 font-bold rounded-md transition duration-150 cursor-pointer ${filterStatus === status ? 'bg-[#004a99] text-white shadow-xs' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {status}
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
                <th className="py-3.5 px-6">Declaración SAG</th>
                <th className="py-3.5 px-6">Productos declarados</th>
                <th className="py-3.5 px-6">Estado</th>
                <th className="py-3.5 px-6 text-center">Acciones de Inspección</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 text-xs font-medium">
              {filteredTramites.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 px-6 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <FileText className="w-8 h-8 text-gray-300" />
                      <p className="font-medium text-sm">No se encontraron declaraciones SAG para la búsqueda.</p>
                      <p className="text-xs">Los viajeros deben rellenar su declaración en su portal primero.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTramites.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50/50 transition">
                    {/* Traveler identity */}
                    <td className="py-4 px-6">
                      <p className="font-bold text-gray-800">{t.travelerName}</p>
                      <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-0.5">
                        <span className="font-mono">{t.travelerRut}</span>
                        <span>•</span>
                        <span>{t.travelerNationality}</span>
                      </div>
                    </td>

                    {/* SAG Declaration summary indicator */}
                    <td className="py-4 px-6 font-medium">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${t.sag.hasVegetables ? 'bg-amber-400' : 'bg-gray-200'}`}></span>
                          <span>Veg: {t.sag.hasVegetables ? 'SÍ' : 'NO'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${t.sag.hasAnimals ? 'bg-amber-400' : 'bg-gray-200'}`}></span>
                          <span>Anim: {t.sag.hasAnimals ? 'SÍ' : 'NO'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${t.sag.hasFood ? 'bg-amber-400' : 'bg-gray-200'}`}></span>
                          <span>Alim: {t.sag.hasFood ? 'SÍ' : 'NO'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${t.sag.hasPets ? 'bg-amber-400' : 'bg-gray-200'}`}></span>
                          <span>Masc: {t.sag.hasPets ? 'SÍ' : 'NO'}</span>
                        </div>
                      </div>
                    </td>

                    {/* Products details */}
                    <td className="py-4 px-6 max-w-xs">
                      <p className="text-gray-600 line-clamp-3 leading-relaxed">
                        {getProductsSummary(t)}
                      </p>
                      {t.sag.comments && (
                        <p className="text-[10px] bg-slate-100 text-gray-500 p-1.5 rounded mt-1.5 border-l-2 border-slate-400 leading-normal">
                          <strong>Obs:</strong> {t.sag.comments}
                        </p>
                      )}
                    </td>

                    {/* SAG state badge */}
                    <td className="py-4 px-6">
                      {t.sag.status === 'Aprobado' ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2 py-0.5 rounded-full text-[10px]">
                          APROBADO
                        </span>
                      ) : t.sag.status === 'Rechazado' ? (
                        <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 border border-red-200 font-bold px-2 py-0.5 rounded-full text-[10px]">
                          RECHAZADO
                        </span>
                      ) : t.sag.status === 'Retenido' ? (
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 font-bold px-2 py-0.5 rounded-full text-[10px]">
                          REMANENTE RETENIDO
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 font-bold px-2 py-0.5 rounded-full text-[10px] animate-pulse">
                          PENDIENTE REVISIÓN
                        </span>
                      )}
                    </td>

                    {/* Quick inspection action buttons */}
                    <td className="py-4 px-6 text-center">
                      <div className="flex justify-center items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleApprove(t)}
                          disabled={t.sag.status === 'Aprobado'}
                          className="bg-emerald-50 hover:bg-emerald-500 text-emerald-700 hover:text-white border border-emerald-200 disabled:opacity-40 disabled:hover:bg-emerald-50 disabled:hover:text-emerald-700 p-2 rounded-lg transition"
                          title="Aprobar Declaración Sanitaria"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => handleReject(t)}
                          disabled={t.sag.status === 'Rechazado'}
                          className="bg-red-50 hover:bg-red-500 text-red-700 hover:text-white border border-red-200 disabled:opacity-40 disabled:hover:bg-red-50 disabled:hover:text-red-700 p-2 rounded-lg transition"
                          title="Rechazar Declaración Sanitaria"
                        >
                          <X className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleInitiateRetention(t.id)}
                          disabled={t.sag.status === 'Retenido'}
                          className="bg-amber-50 hover:bg-amber-600 text-amber-700 hover:text-white border border-amber-200 disabled:opacity-40 disabled:hover:bg-amber-50 disabled:hover:text-amber-700 px-2.5 py-2 rounded-lg transition text-[10px] font-bold flex items-center gap-1"
                          title="Retener mercancías peligrosas"
                        >
                          <Archive className="w-3.5 h-3.5" /> Retener
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

      {/* Phytosanitary instructions alert info */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex gap-3 text-xs text-slate-600">
        <Clock className="w-4.5 h-4.5 text-[#004a99] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-slate-800 uppercase tracking-wide font-display text-[11px] flex items-center gap-1">📌 Directriz de Trabajo del Inspector SAG:</p>
          <p className="leading-relaxed">
            Al presionar <strong className="text-slate-850">Aprobar</strong>, el expediente pasará de inmediato a la bandeja del Funcionario de Aduana. Al presionar <strong className="text-slate-850">Rechazar</strong>, se denegará automáticamente el ingreso al país del viajero de manera inmediata. Al presionar <strong className="text-slate-850">Retener</strong>, los productos prohibidos son confiscados pero el viajero puede continuar con su revisión en Aduanas.
          </p>
        </div>
      </div>
    </div>
  );
}
