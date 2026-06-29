/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Check, 
  X, 
  Fingerprint, 
  Eye, 
  Clock, 
  MapPin, 
  Filter,
  User,
  CheckCircle,
  FileText,
  Building,
  AlertCircle
} from 'lucide-react';
import { Tramite } from '../types';

interface PdiOfficerPanelProps {
  tramites: Tramite[];
  onUpdateTramite: (tramite: Tramite) => void;
}

export default function PdiOfficerPanel({ tramites, onUpdateTramite }: PdiOfficerPanelProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'Todos' | 'Pendiente' | 'Aprobado' | 'Rechazado'>('Todos');

  // Modal States
  const [selectedTramiteForValidation, setSelectedTramiteForValidation] = useState<Tramite | null>(null);
  const [selectedTramiteForDetails, setSelectedTramiteForDetails] = useState<Tramite | null>(null);
  
  // Feedback states
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Filter and find appropriate procedures for PDI control
  const filteredTramites = tramites.filter(t => {
    const matchesSearch = 
      t.travelerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      t.travelerRut.toLowerCase().includes(searchTerm.toLowerCase());

    // PDI reviews travelers that have completed PDI forms
    const hasPdiForm = t.pdi.completed;
    const currentPdiStatus = t.pdi.status || 'Pendiente';
    const matchesFilter = filterStatus === 'Todos' || currentPdiStatus === filterStatus;

    return hasPdiForm && matchesSearch && matchesFilter;
  });

  const handleValidateIdentity = (tramite: Tramite) => {
    setSelectedTramiteForValidation(tramite);
  };

  const handleConfirmValidation = () => {
    if (!selectedTramiteForValidation) return;

    const updated: Tramite = {
      ...selectedTramiteForValidation,
      pdi: {
        ...selectedTramiteForValidation.pdi,
        identityValidated: true,
        status: 'Pendiente' // Keeps status as pending for final approve/reject
      }
    };

    onUpdateTramite(updated);
    setSelectedTramiteForValidation(null);
    
    // Show success message
    setSuccessToast("Identidad validada correctamente.");
    setTimeout(() => {
      setSuccessToast(null);
    }, 4000);
  };

  const handleApprovePdi = (tramite: Tramite) => {
    if (!tramite.pdi.identityValidated) {
      alert("Debe validar primero la identidad del viajero antes de aprobar.");
      return;
    }

    const updated: Tramite = {
      ...tramite,
      pdi: {
        ...tramite.pdi,
        status: 'Aprobado',
        comments: 'Control migratorio PDI aprobado. Identidad autenticada por biometría.'
      },
      // Pass to next step (Revisión SAG, or directly to Revisión Aduana if SAG is not pending)
      status: tramite.status === 'Revisión PDI' ? 'Revisión SAG' : tramite.status,
      docsStatus: 'Pendiente de revisión'
    };

    onUpdateTramite(updated);
    
    setSuccessToast(`Trámite de ${tramite.travelerName} aprobado y enviado a la siguiente estación de control.`);
    setTimeout(() => {
      setSuccessToast(null);
    }, 4000);
  };

  const handleRejectPdi = (tramite: Tramite) => {
    const reason = prompt("Por favor, ingrese el motivo de rechazo de ingreso (PDI):", "No cumple con requisitos migratorios o inconsistencia en validación de identidad.");
    if (reason === null) return; // cancelled

    const updated: Tramite = {
      ...tramite,
      pdi: {
        ...tramite.pdi,
        status: 'Rechazado',
        comments: reason
      },
      status: 'Rechazado',
      docsStatus: 'Faltan documentos',
      finalDecisionReason: `Ingreso Rechazado por PDI: ${reason}`
    };

    onUpdateTramite(updated);

    setSuccessToast(`Ingreso de ${tramite.travelerName} rechazado correctamente.`);
    setTimeout(() => {
      setSuccessToast(null);
    }, 4000);
  };

  return (
    <div className="space-y-6 py-6 px-4 max-w-6xl mx-auto">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="bg-[#004a99] text-white p-3 rounded-xl shadow-md shadow-blue-500/10">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 font-display uppercase tracking-tight">Panel del Funcionario PDI</h1>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Policía de Investigaciones de Chile • Control Migratorio Los Libertadores</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 self-start text-[10px] font-bold text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full font-display uppercase tracking-wide">
          <Building className="w-3.5 h-3.5 text-[#004a99]" />
          <span>ESTACIÓN MIGRATORIA PDI</span>
        </div>
      </div>

      {/* Toast Notification */}
      {successToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-3 animate-fade-in shadow-sm">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="font-bold text-xs uppercase tracking-wide font-display">{successToast}</p>
        </div>
      )}

      {/* Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar viajero por nombre o documento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#004a99] transition font-medium"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 self-stretch md:self-auto overflow-x-auto py-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1.5 shrink-0 font-display">
              <Filter className="w-3.5 h-3.5 text-[#004a99]" /> Filtrar estado PDI:
            </span>
            <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs">
              {(['Todos', 'Pendiente', 'Aprobado', 'Rechazado'] as const).map((status) => {
                const currentPdiStatus = filterStatus === status;
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-1 font-bold rounded-md transition duration-150 cursor-pointer ${currentPdiStatus ? 'bg-[#004a99] text-white shadow-xs' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    {status}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Table representation */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 font-display">
                <th className="py-3.5 px-6">Nombre del Viajero</th>
                <th className="py-3.5 px-6">RUT o Pasaporte</th>
                <th className="py-3.5 px-6">Nacionalidad</th>
                <th className="py-3.5 px-6">Motivo de Viaje</th>
                <th className="py-3.5 px-4">País de Origen / Destino</th>
                <th className="py-3.5 px-4 text-center">Estado Validación</th>
                <th className="py-3.5 px-6 text-center">Acciones PDI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 text-xs font-medium">
              {filteredTramites.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 px-6 text-center text-slate-400 italic font-medium">
                    No se encontraron trámites migratorios disponibles para los criterios seleccionados.
                  </td>
                </tr>
              ) : (
                filteredTramites.map((tramite) => {
                  const pdiStatus = tramite.pdi.status || 'Pendiente';
                  const isValidated = tramite.pdi.identityValidated || false;

                  return (
                    <tr key={tramite.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-800">{tramite.travelerName}</div>
                        <div className="text-[10px] text-slate-400">{tramite.travelerEmail}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-mono font-bold bg-slate-50 border px-2 py-1 rounded text-slate-700">
                          {tramite.pdi.docType}: {tramite.pdi.docNumber}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-600">{tramite.travelerNationality}</td>
                      <td className="py-4 px-6">
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold text-[10px]">
                          {tramite.pdi.travelReason}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-600">
                        <div>De: {tramite.pdi.originCountry}</div>
                        <div>A: {tramite.pdi.destinationCountry}</div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex flex-col items-center justify-center gap-1">
                          {isValidated ? (
                            <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                              <Fingerprint className="w-3 h-3 text-emerald-600" /> Identidad Validada
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                              <Clock className="w-3 h-3 text-amber-600" /> Pendiente Validar
                            </span>
                          )}

                          {/* Approval Status */}
                          {pdiStatus === 'Aprobado' && (
                            <span className="text-[10px] text-emerald-600 font-bold uppercase">✓ Migración Aprobada</span>
                          )}
                          {pdiStatus === 'Rechazado' && (
                            <span className="text-[10px] text-red-600 font-bold uppercase">✗ Ingreso Rechazado</span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap items-center justify-center gap-1.5">
                          {/* Validate identity button */}
                          <button
                            type="button"
                            onClick={() => handleValidateIdentity(tramite)}
                            className={`p-2 rounded-lg border transition-all flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide cursor-pointer ${
                              isValidated 
                                ? 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100' 
                                : 'bg-[#004a99] hover:bg-[#003d80] text-white border-transparent shadow-xs'
                            }`}
                            title="Validación biométrica y de identidad"
                          >
                            <Fingerprint className="w-3.5 h-3.5" /> Validar identidad
                          </button>

                          {/* Ver declaración */}
                          <button
                            type="button"
                            onClick={() => setSelectedTramiteForDetails(tramite)}
                            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-250 rounded-lg text-[10px] font-bold uppercase tracking-wide transition cursor-pointer flex items-center gap-1"
                            title="Ver detalles del trámite"
                          >
                            <Eye className="w-3.5 h-3.5" /> Ver declaración
                          </button>

                          {/* Aprobar */}
                          <button
                            type="button"
                            disabled={pdiStatus === 'Aprobado'}
                            onClick={() => handleApprovePdi(tramite)}
                            className={`p-2 rounded-lg border text-[10px] font-bold uppercase tracking-wide transition flex items-center gap-1 cursor-pointer ${
                              pdiStatus === 'Aprobado'
                                ? 'bg-emerald-50 text-emerald-400 border-emerald-100 opacity-60 cursor-not-allowed'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white border-transparent hover:shadow-xs'
                            }`}
                            title="Aprobar ingreso migratorio"
                          >
                            <Check className="w-3.5 h-3.5" /> Aprobar
                          </button>

                          {/* Rechazar */}
                          <button
                            type="button"
                            disabled={pdiStatus === 'Rechazado'}
                            onClick={() => handleRejectPdi(tramite)}
                            className={`p-2 rounded-lg border text-[10px] font-bold uppercase tracking-wide transition flex items-center gap-1 cursor-pointer ${
                              pdiStatus === 'Rechazado'
                                ? 'bg-red-50 text-red-400 border-red-100 opacity-60 cursor-not-allowed'
                                : 'bg-red-600 hover:bg-red-750 text-white border-transparent hover:shadow-xs'
                            }`}
                            title="Rechazar ingreso"
                          >
                            <X className="w-3.5 h-3.5" /> Rechazar
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

      {/* Info warning */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex gap-3 text-xs text-slate-600">
        <AlertCircle className="w-4.5 h-4.5 text-[#004a99] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-slate-800 uppercase tracking-wide font-display text-[11px]">📌 Directriz del Control Fronterizo Integrado PDI:</p>
          <p className="leading-relaxed">
            De acuerdo con la legislación migratoria de la República de Chile, es **requisito obligatorio** realizar la verificación documental y biométrica de identidad antes de otorgar la visación de ingreso al país. Al corroborar la validación y presionar **Aprobar**, el viajero será derivado a la inspección de sanidad del SAG y posteriormente a la revisión final de la aduana.
          </p>
        </div>
      </div>

      {/* MODAL 1: VALIDATE IDENTITY */}
      {selectedTramiteForValidation && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden">
            <div className="bg-[#004a99] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Fingerprint className="w-5 h-5 text-blue-100" />
                <h3 className="font-extrabold text-sm uppercase font-display tracking-wider">Validación de Identidad Biométrica</h3>
              </div>
              <button 
                onClick={() => setSelectedTramiteForValidation(null)} 
                className="text-white/80 hover:text-white p-1"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              
              {/* Traveler Biometric Passport Mock Card */}
              <div className="border border-slate-200 rounded-xl p-4 bg-gradient-to-br from-slate-50 to-slate-100/30 flex gap-4 relative overflow-hidden">
                <div className="absolute top-2 right-2 flex items-center gap-1 text-[8px] font-bold text-slate-400 border border-slate-200 px-1.5 py-0.5 rounded-full bg-white">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                  PDI BIOMÉTRICO
                </div>

                {/* Left side: simulated Photo */}
                <div className="w-24 h-28 bg-slate-200 border border-slate-350 rounded-lg flex flex-col items-center justify-center text-slate-400 relative overflow-hidden shadow-xs shrink-0">
                  <User className="w-12 h-12 text-slate-400" />
                  <span className="text-[8px] uppercase tracking-wider font-extrabold text-slate-500 mt-1 bg-white border border-slate-200 px-1 py-0.5 rounded shadow-2xs">PASSPORT PHOTO</span>
                  
                  {/* Biometric Scan grid simulator lines */}
                  <div className="absolute inset-0 border border-blue-500/10 pointer-events-none"></div>
                  <div className="absolute top-1/4 left-0 right-0 h-0.5 bg-blue-500/20 animate-pulse"></div>
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-blue-500/30"></div>
                </div>

                {/* Right side: passport/ID data */}
                <div className="space-y-1.5 text-xs flex-grow font-medium text-slate-700">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">DOCUMENTO DEL VIAJERO</p>
                  <div>
                    <span className="text-[10px] text-slate-400 block -mb-0.5">Nombre Completo</span>
                    <span className="font-bold text-slate-850 uppercase">{selectedTramiteForValidation.travelerName}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-0.5">
                    <div>
                      <span className="text-[10px] text-slate-400 block -mb-0.5">Nacionalidad</span>
                      <span className="font-semibold text-slate-800">{selectedTramiteForValidation.travelerNationality}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block -mb-0.5">{selectedTramiteForValidation.pdi.docType}</span>
                      <span className="font-mono font-bold text-slate-800">{selectedTramiteForValidation.pdi.docNumber}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-400 block -mb-0.5">Teléfono</span>
                      <span className="text-slate-600">{selectedTramiteForValidation.travelerPhone}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block -mb-0.5">Correo</span>
                      <span className="text-slate-600 truncate block max-w-[100px]">{selectedTramiteForValidation.travelerEmail}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resultado de la Verificación */}
              <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl space-y-1.5">
                <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider font-display flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#004a99]" /> Resultado de la verificación:
                </h4>
                <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                  ✓ Coincidencia biométrica dactilar y reconocimiento facial con base Registro Civil: **98.2%**. <br />
                  ✓ Documentación física auténtica (chip RFID verificado). <br />
                  ✓ **Sin requerimientos ni órdenes de detención vigentes** en bases de datos nacionales (PDI / Carabineros) ni internacionales (Interpol). <br />
                  ✓ Declarado apto para ingreso legal.
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedTramiteForValidation(null)}
                  className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-2.5 px-4 rounded-lg border border-slate-200 transition text-[11px] uppercase tracking-wide cursor-pointer font-display"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmValidation}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-5 rounded-lg shadow-sm hover:shadow transition text-[11px] uppercase tracking-wide cursor-pointer font-display flex items-center gap-1"
                >
                  <Check className="w-4 h-4" /> Confirmar validación
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: VIEW ALL DECLARATIONS DETAILS */}
      {selectedTramiteForDetails && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-2xl w-full overflow-hidden">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-100" />
                <h3 className="font-extrabold text-sm uppercase font-display tracking-wider">Expediente de Declaraciones • {selectedTramiteForDetails.travelerName}</h3>
              </div>
              <button 
                onClick={() => setSelectedTramiteForDetails(null)} 
                className="text-white/80 hover:text-white p-1"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Header profile block */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-150 text-xs font-medium">
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Viajero</span>
                  <span className="font-bold text-slate-800">{selectedTramiteForDetails.travelerName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Identificación</span>
                  <span className="font-mono font-bold text-slate-800">{selectedTramiteForDetails.pdi.docType} {selectedTramiteForDetails.pdi.docNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Nacionalidad</span>
                  <span className="text-slate-700">{selectedTramiteForDetails.travelerNationality}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Fecha de Inicio</span>
                  <span className="text-slate-700">{new Date(selectedTramiteForDetails.dateCreated).toLocaleDateString()}</span>
                </div>
              </div>

              {/* PDI block */}
              <div className="border border-slate-200 rounded-xl p-4 space-y-2">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider font-display border-b pb-1.5 flex items-center justify-between">
                  <span>1. Control Migratorio PDI</span>
                  <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-semibold">Completado</span>
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs font-medium text-slate-600">
                  <p><strong className="text-slate-700">País Origen:</strong> {selectedTramiteForDetails.pdi.originCountry}</p>
                  <p><strong className="text-slate-700">País Destino:</strong> {selectedTramiteForDetails.pdi.destinationCountry}</p>
                  <p><strong className="text-slate-700">Motivo:</strong> {selectedTramiteForDetails.pdi.travelReason}</p>
                  <p><strong className="text-slate-700">Tiempo de estadía:</strong> {selectedTramiteForDetails.pdi.stayDays} días</p>
                  <p><strong className="text-slate-700">Documentación:</strong> {selectedTramiteForDetails.pdi.docType} {selectedTramiteForDetails.pdi.docNumber}</p>
                </div>
              </div>

              {/* SAG block */}
              <div className="border border-slate-200 rounded-xl p-4 space-y-2">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider font-display border-b pb-1.5 flex items-center justify-between">
                  <span>2. Declaración Fitosanitaria SAG</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${selectedTramiteForDetails.sag.completed ? 'text-blue-600 bg-blue-50' : 'text-slate-400 bg-slate-50'}`}>
                    {selectedTramiteForDetails.sag.completed ? 'Completado' : 'No Iniciado'}
                  </span>
                </h4>
                {selectedTramiteForDetails.sag.completed ? (
                  <div className="space-y-1.5 text-xs font-medium text-slate-600">
                    <p>🌱 <strong className="text-slate-700">Vegetales/Nueces:</strong> {selectedTramiteForDetails.sag.hasVegetables ? `Sí. Descripción: ${selectedTramiteForDetails.sag.vegetablesDesc}` : 'No'}</p>
                    <p>🥩 <strong className="text-slate-700">Animales/Derivados:</strong> {selectedTramiteForDetails.sag.hasAnimals ? `Sí. Descripción: ${selectedTramiteForDetails.sag.animalsDesc}` : 'No'}</p>
                    <p>🍯 <strong className="text-slate-700">Alimentos/Orgánicos:</strong> {selectedTramiteForDetails.sag.hasFood ? `Sí. Descripción: ${selectedTramiteForDetails.sag.foodDesc}` : 'No'}</p>
                    <p>🐶 <strong className="text-slate-700">Mascotas vivas:</strong> {selectedTramiteForDetails.sag.hasPets ? `Sí. Descripción: ${selectedTramiteForDetails.sag.petsDesc}` : 'No'}</p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic font-medium">El viajero no ha completado la declaración fitosanitaria.</p>
                )}
              </div>

              {/* Vehicle block */}
              <div className="border border-slate-200 rounded-xl p-4 space-y-2">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider font-display border-b pb-1.5 flex items-center justify-between">
                  <span>3. Registro de Vehículo</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${selectedTramiteForDetails.vehicle.completed ? 'text-blue-600 bg-blue-50' : 'text-slate-400 bg-slate-50'}`}>
                    {selectedTramiteForDetails.vehicle.completed ? 'Completado' : 'No Iniciado'}
                  </span>
                </h4>
                {selectedTramiteForDetails.vehicle.completed ? (
                  selectedTramiteForDetails.vehicle.registered ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-medium text-slate-600">
                      <p><strong className="text-slate-700">Patente:</strong> <span className="font-mono bg-slate-100 border px-1 rounded text-slate-800 font-bold">{selectedTramiteForDetails.vehicle.plate}</span></p>
                      <p><strong className="text-slate-700">Marca/Modelo:</strong> {selectedTramiteForDetails.vehicle.brand} {selectedTramiteForDetails.vehicle.model}</p>
                      <p><strong className="text-slate-700">Año:</strong> {selectedTramiteForDetails.vehicle.year}</p>
                      <p><strong className="text-slate-700">Color:</strong> {selectedTramiteForDetails.vehicle.color}</p>
                    </div>
                  ) : (
                    <p className="text-xs text-[#004a99] font-bold">El viajero ingresa al país bajo modalidad PEATÓN o PASAJERO DE BUS.</p>
                  )
                ) : (
                  <p className="text-xs text-slate-400 italic font-medium">El viajero no ha completado el registro vehicular.</p>
                )}
              </div>
            </div>

            {/* Bottom action bar */}
            <div className="p-4 bg-slate-50 border-t border-slate-150 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedTramiteForDetails(null)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-5 rounded-lg text-xs uppercase tracking-wide cursor-pointer font-display"
              >
                Cerrar Expediente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
