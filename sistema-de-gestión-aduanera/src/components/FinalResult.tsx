/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CheckCircle, XCircle, ArrowLeft, Printer, ShieldCheck, QrCode, FileText, ChevronRight } from 'lucide-react';
import { Tramite } from '../types';

interface FinalResultProps {
  tramite: Tramite;
  onBack: () => void;
}

export default function FinalResult({ tramite, onBack }: FinalResultProps) {
  const isApproved = tramite.status === 'Autorizado';
  const isRejected = tramite.status === 'Rechazado';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-6 animate-fade-in" id="final-result-screen">
      {/* Back button */}
      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-800 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al menú
        </button>
        <button
          type="button"
          onClick={handlePrint}
          className="flex items-center gap-1 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 font-semibold text-xs px-3 py-1.5 rounded-lg transition cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5" /> Imprimir Comprobante
        </button>
      </div>

      {/* Main Boarding Pass Card */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden" id="border-pass">
        
        {/* Top Decision Banner */}
        {isApproved ? (
          <div className="bg-emerald-600 text-white p-8 text-center space-y-3">
            <div className="mx-auto bg-white/10 w-20 h-20 rounded-full flex items-center justify-center border border-white/20 shadow-inner">
              <CheckCircle className="w-12 h-12 text-white animate-pulse" />
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-black uppercase tracking-wider">✔ Ingreso Autorizado</h1>
              <p className="text-xs text-emerald-100/90 font-medium font-mono uppercase tracking-widest">Border Pass Approved</p>
            </div>
          </div>
        ) : isRejected ? (
          <div className="bg-red-600 text-white p-8 text-center space-y-3">
            <div className="mx-auto bg-white/10 w-20 h-20 rounded-full flex items-center justify-center border border-white/20 shadow-inner">
              <XCircle className="w-12 h-12 text-white animate-shake" />
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-black uppercase tracking-wider">✖ Ingreso Rechazado</h1>
              <p className="text-xs text-red-100/90 font-medium font-mono uppercase tracking-widest">Border Pass Rejected</p>
            </div>
          </div>
        ) : (
          <div className="bg-amber-500 text-white p-8 text-center space-y-3">
            <div className="mx-auto bg-white/10 w-20 h-20 rounded-full flex items-center justify-center border border-white/20 shadow-inner">
              <FileText className="w-12 h-12 text-white" />
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-black uppercase tracking-wider">Trámite en Revisión</h1>
              <p className="text-xs text-amber-100/90 font-medium font-mono uppercase tracking-widest">Under Review</p>
            </div>
          </div>
        )}

        {/* Detailed Ticket Body */}
        <div className="p-6 md:p-8 space-y-6">
          
          {/* Reason Box */}
          <div className={`p-4 rounded-xl border text-xs space-y-1.5 ${isApproved ? 'bg-emerald-50/50 border-emerald-100 text-emerald-900' : isRejected ? 'bg-red-50/50 border-red-100 text-red-900' : 'bg-amber-50/50 border-amber-100 text-amber-900'}`}>
            <p className="font-bold uppercase tracking-wider">Motivo de Resolución:</p>
            <p className="leading-relaxed font-sans font-medium">
              {tramite.finalDecisionReason || (isApproved ? 'Aprobado de manera regular tras cumplir con los controles sanitarios (SAG) y policiales (PDI).' : 'No autorizado por irregularidades pendientes en la revisión migratoria o vehicular.')}
            </p>
          </div>

          {/* Traveler Info Split */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-dashed border-gray-200 pt-6 text-xs">
            <div>
              <p className="text-gray-400 font-bold uppercase tracking-wide text-[10px]">Viajero / Traveler</p>
              <p className="font-bold text-gray-800 text-sm mt-0.5">{tramite.travelerName}</p>
            </div>
            <div>
              <p className="text-gray-400 font-bold uppercase tracking-wide text-[10px]">Identificación / Document ID</p>
              <p className="font-mono font-bold text-gray-800 text-sm mt-0.5">{tramite.travelerRut}</p>
            </div>
            <div>
              <p className="text-gray-400 font-bold uppercase tracking-wide text-[10px]">Nacionalidad / Nationality</p>
              <p className="font-bold text-gray-800 mt-0.5">{tramite.travelerNationality}</p>
            </div>
            <div>
              <p className="text-gray-400 font-bold uppercase tracking-wide text-[10px]">Origen / Origin</p>
              <p className="font-bold text-gray-800 mt-0.5">{tramite.pdi.originCountry || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-400 font-bold uppercase tracking-wide text-[10px]">Fecha Control / Date of Control</p>
              <p className="font-bold text-gray-800 mt-0.5">{new Date(tramite.dateCreated).toLocaleDateString()} {new Date(tramite.dateCreated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
            <div>
              <p className="text-gray-400 font-bold uppercase tracking-wide text-[10px]">Modalidad de Ingreso / Entry Mode</p>
              <p className="font-bold text-gray-800 mt-0.5">
                {tramite.vehicle.registered ? `Vehicular (${tramite.vehicle.plate})` : 'Peatonal'}
              </p>
            </div>
          </div>

          {/* Verification Barcode / Footer */}
          <div className="border-t border-dashed border-gray-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <QrCode className="w-16 h-16 text-gray-700 shrink-0 border p-1 rounded-lg" />
              <div className="space-y-0.5">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Código de Validación Digital</p>
                <p className="font-mono text-xs text-gray-600 font-semibold">{tramite.id.toUpperCase()}</p>
                <div className="flex items-center gap-1 text-[9px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.2 rounded w-fit">
                  <ShieldCheck className="w-3 h-3" /> FIRMADO DIGITALMENTE
                </div>
              </div>
            </div>
            {/* Simulated barcode */}
            <div className="flex flex-col items-center">
              <div className="h-8 bg-gray-900 w-44 flex items-center overflow-hidden rounded">
                <div className="h-full w-full bg-repeating-barcode opacity-90"></div>
              </div>
              <span className="text-[9px] font-mono text-gray-400 mt-1">PASO FRONTERIZO INTEGRADO</span>
            </div>
          </div>
        </div>
      </div>

      {/* Helpful testing advice */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-xs text-gray-600 space-y-1.5">
        <h4 className="font-bold text-blue-900 uppercase">💡 Información de Prueba:</h4>
        <p>
          Este comprobante simula la credencial electrónica final que el viajero presentará en la barrera física del paso fronterizo.
        </p>
        <p>
          Si desea probar otro escenario, puede registrar un nuevo viajero o cambiar decisiones usando el <strong>Selector de Roles</strong> de la barra superior.
        </p>
      </div>
    </div>
  );
}
