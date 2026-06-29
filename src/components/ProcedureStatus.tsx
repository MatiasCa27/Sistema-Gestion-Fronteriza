/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  CheckCircle, 
  Circle, 
  Hourglass, 
  XCircle, 
  ArrowLeft, 
  Clock, 
  ShieldAlert, 
  FileText,
  AlertTriangle
} from 'lucide-react';
import { Tramite } from '../types';

interface ProcedureStatusProps {
  tramite: Tramite;
  onBack: () => void;
  onNavigateToResult?: () => void;
}

export default function ProcedureStatus({ tramite, onBack, onNavigateToResult }: ProcedureStatusProps) {
  
  // Calculate form completion
  const sagDone = tramite.sag.completed;
  const pdiDone = tramite.pdi.completed;
  const vehDone = tramite.vehicle.completed;
  const allFormsDone = sagDone && pdiDone && vehDone;

  // Compute specific status message
  const getStatusNotification = () => {
    if (tramite.status === 'Autorizado') {
      return {
        title: '¡Ingreso Autorizado!',
        desc: 'Su trámite ha sido aprobado de manera definitiva por el funcionario de aduanas. Puede proceder al paso de frontera.',
        style: 'bg-emerald-50 border-emerald-200 text-emerald-800',
        badge: 'Declaración aprobada y autorizada.'
      };
    }
    if (tramite.status === 'Rechazado') {
      return {
        title: 'Ingreso Rechazado',
        desc: tramite.finalDecisionReason || 'Su solicitud de ingreso ha sido rechazada debido a observaciones críticas encontradas por las autoridades de control.',
        style: 'bg-red-50 border-red-200 text-red-800',
        badge: 'Solicitud rechazada.'
      };
    }
    if (!allFormsDone) {
      return {
        title: 'Documentación Pendiente',
        desc: 'Aún quedan formularios obligatorios que no ha completado. Por favor, llene todas las declaraciones del menú principal para iniciar la revisión.',
        style: 'bg-amber-50 border-amber-200 text-amber-800',
        badge: 'Faltan documentos.'
      };
    }
    if (tramite.status === 'Revisión PDI') {
      return {
        title: 'Pendiente de Validación por PDI',
        desc: 'Toda su documentación ha sido cargada correctamente. El Funcionario de la Policía de Investigaciones (PDI) está revisando sus datos migratorios y debe validar su identidad biométricamente.',
        style: 'bg-indigo-50 border-indigo-200 text-indigo-800',
        badge: 'En revisión de PDI.'
      };
    }
    if (tramite.status === 'Revisión SAG') {
      return {
        title: 'Pendiente de Revisión por SAG',
        desc: 'El control migratorio de PDI ha sido validado correctamente. El Inspector del Servicio Agrícola y Ganadero (SAG) está revisando sus declaraciones de salud animal y vegetal.',
        style: 'bg-emerald-50 border-emerald-200 text-emerald-800',
        badge: 'Aprobado por PDI. En revisión SAG.'
      };
    }
    if (tramite.status === 'Revisión Aduana') {
      return {
        title: 'Pendiente de Revisión por Aduana',
        desc: 'Las inspecciones de PDI y de sanidad del SAG han finalizado con éxito. El Funcionario de Aduana está verificando los documentos de identidad y vehiculares para emitir la resolución final.',
        style: 'bg-blue-50 border-blue-200 text-blue-800',
        badge: 'Aprobado por PDI y SAG. En revisión de aduana.'
      };
    }

    return {
      title: 'Pendiente de Revisión',
      desc: 'Toda la documentación está completa. Su expediente ha entrado en la cola de atención del paso fronterizo.',
      style: 'bg-slate-50 border-slate-200 text-slate-800',
      badge: 'Documentación completa.'
    };
  };

  const notification = getStatusNotification();

  // Define steps for progress line
  const steps = [
    { name: 'Registro de Cuenta', completed: true, label: '✅ Registro' },
    { name: 'Declaración SAG', completed: sagDone, label: '✅ Declaración SAG' },
    { name: 'Declaración PDI', completed: pdiDone, label: '✅ Declaración PDI' },
    { name: 'Vehículo', completed: vehDone, label: '✅ Vehículo' },
    { 
      name: 'Revisión Autoridades', 
      completed: allFormsDone, 
      inProgress: allFormsDone && (tramite.status === 'Revisión PDI' || tramite.status === 'Revisión SAG' || tramite.status === 'Revisión Aduana'),
      label: '⏳ Revisión Autoridades' 
    },
    { 
      name: 'Resolución Final', 
      completed: tramite.status === 'Autorizado',
      failed: tramite.status === 'Rechazado',
      label: tramite.status === 'Rechazado' ? '❌ Rechazado' : '✅ Autorizado'
    }
  ];

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-800 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Estado del Trámite</h1>
            <p className="text-gray-500 text-sm">Monitoreo del expediente fronterizo en tiempo real</p>
          </div>
        </div>

        {(tramite.status === 'Autorizado' || tramite.status === 'Rechazado') && onNavigateToResult && (
          <button
            type="button"
            onClick={onNavigateToResult}
            className="bg-[#004a99] hover:bg-[#003d80] text-white font-bold text-xs px-4 py-2.5 rounded-lg transition shadow-sm font-display uppercase tracking-wide cursor-pointer"
          >
            Ver Resultado Final
          </button>
        )}
      </div>

      {/* Dynamic Notification Message */}
      <div className={`p-5 border rounded-2xl ${notification.style} flex items-start gap-4 shadow-sm`}>
        <div className="mt-1">
          {tramite.status === 'Autorizado' ? (
            <CheckCircle className="w-6 h-6 shrink-0 text-emerald-600" />
          ) : tramite.status === 'Rechazado' ? (
            <XCircle className="w-6 h-6 shrink-0 text-red-600" />
          ) : !allFormsDone ? (
            <AlertTriangle className="w-6 h-6 shrink-0 text-amber-600" />
          ) : (
            <Hourglass className="w-6 h-6 shrink-0 text-[#004a99] animate-spin-slow" />
          )}
        </div>
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-base font-display">{notification.title}</h3>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/50 border border-current/25">
              {notification.badge}
            </span>
          </div>
          <p className="text-sm leading-relaxed opacity-95">{notification.desc}</p>
        </div>
      </div>

      {/* Timeline Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        <h2 className="font-bold text-slate-800 text-base border-b border-slate-150 pb-3 font-display uppercase tracking-wide">Línea de Progreso del Trámite</h2>
        
        {/* Desktop Progress Stepper */}
        <div className="relative pt-2 pb-6">
          {/* Background Connecting Line */}
          <div className="absolute top-7 left-8 right-8 h-1 bg-slate-100 -z-10 hidden md:block"></div>
          {/* Active Progress Line */}
          <div 
            className="absolute top-7 left-8 h-1 bg-[#004a99] -z-10 hidden md:block transition-all duration-500"
            style={{ 
              width: `${
                tramite.status === 'Autorizado' || tramite.status === 'Rechazado' ? '100' :
                tramite.status === 'Revisión Aduana' ? '80' :
                tramite.status === 'Revisión SAG' ? '65' :
                allFormsDone ? '50' : 
                (sagDone && pdiDone) || (sagDone && vehDone) || (pdiDone && vehDone) ? '33' : '15'
              }%` 
            }}
          ></div>

          {/* Stepper Grid */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 md:gap-2">
            {steps.map((step, idx) => {
              const isCurrentReview = step.inProgress;
              
              return (
                <div key={idx} className="flex md:flex-col items-center gap-3 md:gap-2 text-center relative group">
                  {/* Step icon circle */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition duration-200 z-10 ${
                    step.failed
                      ? 'bg-red-50 border-red-500 text-red-600'
                      : step.completed 
                        ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
                        : isCurrentReview 
                          ? 'bg-blue-50 border-blue-600 text-blue-700 animate-pulse'
                          : 'bg-white border-slate-200 text-slate-300'
                  }`}>
                    {step.failed ? (
                      <XCircle className="w-5 h-5" />
                    ) : step.completed ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : isCurrentReview ? (
                      <Hourglass className="w-5 h-5 animate-spin-slow" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </div>

                  {/* Step Info */}
                  <div className="text-left md:text-center space-y-0.5">
                    <p className={`text-xs font-bold tracking-tight ${
                      step.failed ? 'text-red-600' :
                      step.completed ? 'text-slate-800' :
                      isCurrentReview ? 'text-blue-700' : 'text-slate-400'
                    }`}>
                      {step.label}
                    </p>
                    <p className="text-[10px] text-slate-400 font-semibold hidden md:block">{step.name}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Summary table of entered declarations */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h2 className="font-bold text-slate-800 text-base border-b border-slate-150 pb-3 flex items-center gap-2 font-display uppercase tracking-wide">
          <FileText className="w-5 h-5 text-[#004a99]" /> Resumen de Información Declarada
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          
          {/* SAG Card summary */}
          <div className="p-4 rounded-xl bg-slate-50/50 border border-slate-200 space-y-2">
            <h3 className="font-bold text-slate-700 uppercase tracking-wide">1. Declaración SAG</h3>
            {sagDone ? (
              <div className="space-y-1.5 text-slate-600 font-medium">
                <p>🌱 <span className="font-semibold text-slate-700">Veg:</span> {tramite.sag.hasVegetables ? 'Sí (Declarado)' : 'No'}</p>
                <p>🥩 <span className="font-semibold text-slate-700">Anim:</span> {tramite.sag.hasAnimals ? 'Sí (Declarado)' : 'No'}</p>
                <p>🍯 <span className="font-semibold text-slate-700">Alim:</span> {tramite.sag.hasFood ? 'Sí (Declarado)' : 'No'}</p>
                <p>🐶 <span className="font-semibold text-slate-700">Masc:</span> {tramite.sag.hasPets ? 'Sí (Declarado)' : 'No'}</p>
                {tramite.sag.status === 'Retenido' && (
                  <p className="text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 mt-1">
                    <ShieldAlert className="w-3 h-3" /> Mercancía Retenida
                  </p>
                )}
              </div>
            ) : (
              <p className="text-slate-400 italic font-medium">No iniciada</p>
            )}
          </div>

          {/* PDI Card summary */}
          <div className="p-4 rounded-xl bg-slate-50/50 border border-slate-200 space-y-2">
            <h3 className="font-bold text-slate-700 uppercase tracking-wide">2. Control PDI</h3>
            {pdiDone ? (
              <div className="space-y-1 text-slate-600 font-medium">
                <p><span className="font-semibold text-slate-700">Origen:</span> {tramite.pdi.originCountry}</p>
                <p><span className="font-semibold text-slate-700">Destino:</span> {tramite.pdi.destinationCountry}</p>
                <p><span className="font-semibold text-slate-700">Motivo:</span> {tramite.pdi.travelReason}</p>
                <p><span className="font-semibold text-slate-700">Estadía:</span> {tramite.pdi.stayDays} días</p>
                <p><span className="font-semibold text-slate-700">Documento:</span> {tramite.pdi.docType} {tramite.pdi.docNumber}</p>
              </div>
            ) : (
              <p className="text-slate-400 italic font-medium">No iniciada</p>
            )}
          </div>

          {/* Vehicle Card summary */}
          <div className="p-4 rounded-xl bg-slate-50/50 border border-slate-200 space-y-2">
            <h3 className="font-bold text-slate-700 uppercase tracking-wide">3. Vehículo</h3>
            {vehDone ? (
              tramite.vehicle.registered ? (
                <div className="space-y-1 text-slate-600 font-medium">
                  <p><span className="font-semibold text-slate-700">Patente:</span> <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-800 font-bold">{tramite.vehicle.plate}</span></p>
                  <p><span className="font-semibold text-slate-700">Marca/Mod:</span> {tramite.vehicle.brand} {tramite.vehicle.model}</p>
                  <p><span className="font-semibold text-slate-700">Año:</span> {tramite.vehicle.year}</p>
                  <p><span className="font-semibold text-slate-700">Color:</span> {tramite.vehicle.color}</p>
                </div>
              ) : (
                <p className="text-[#004a99] font-bold">Ingreso registrado en modalidad Peatón</p>
              )
            ) : (
              <p className="text-slate-400 italic font-medium">No registrado</p>
            )}
          </div>
        </div>
      </div>

      {/* Date generated info */}
      <div className="text-center text-xs text-gray-400 flex items-center justify-center gap-1.5">
        <Clock className="w-3.5 h-3.5" />
        <span>Expediente iniciado el: {new Date(tramite.dateCreated).toLocaleDateString()} a las {new Date(tramite.dateCreated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    </div>
  );
}
