/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Sprout, 
  UserSquare2, 
  Car, 
  ClipboardList, 
  LogOut, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { TravelerProfile, Tramite } from '../types';

interface TravelerMenuProps {
  profile: TravelerProfile;
  tramite: Tramite;
  onSelectAction: (action: 'sag' | 'pdi' | 'vehicle' | 'status') => void;
  onLogout: () => void;
}

export default function TravelerMenu({ profile, tramite, onSelectAction, onLogout }: TravelerMenuProps) {
  
  const getSagBadge = () => {
    if (tramite.sag.completed) {
      if (tramite.sag.status === 'Retenido') {
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs px-2 py-0.5 rounded-full font-medium">
            <ShieldAlert className="w-3.5 h-3.5" /> Retenido
          </span>
        );
      }
      return (
        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-2 py-0.5 rounded-full font-medium">
          <CheckCircle2 className="w-3.5 h-3.5" /> Completada
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 bg-gray-50 text-gray-500 border border-gray-200 text-xs px-2 py-0.5 rounded-full font-medium">
        <AlertCircle className="w-3.5 h-3.5" /> Pendiente
      </span>
    );
  };

  const getPdiBadge = () => {
    if (tramite.pdi.completed) {
      return (
        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-2 py-0.5 rounded-full font-medium">
          <CheckCircle2 className="w-3.5 h-3.5" /> Completada
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 bg-gray-50 text-gray-500 border border-gray-200 text-xs px-2 py-0.5 rounded-full font-medium">
        <AlertCircle className="w-3.5 h-3.5" /> Pendiente
      </span>
    );
  };

  const getVehicleBadge = () => {
    if (tramite.vehicle.completed) {
      if (tramite.vehicle.registered) {
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-2 py-0.5 rounded-full font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" /> Vehículo Registrado
          </span>
        );
      } else {
        return (
          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 text-xs px-2 py-0.5 rounded-full font-medium">
            Ingreso Peatonal
          </span>
        );
      }
    }
    return (
      <span className="inline-flex items-center gap-1 bg-gray-50 text-gray-500 border border-gray-200 text-xs px-2 py-0.5 rounded-full font-medium">
        <AlertCircle className="w-3.5 h-3.5" /> Pendiente
      </span>
    );
  };

  const getGeneralStatusBadge = () => {
    switch (tramite.status) {
      case 'Autorizado':
        return <span className="bg-emerald-500 text-white font-semibold text-xs px-2.5 py-1 rounded-full">✔ AUTORIZADO</span>;
      case 'Rechazado':
        return <span className="bg-red-500 text-white font-semibold text-xs px-2.5 py-1 rounded-full">✖ RECHAZADO</span>;
      case 'Revisión SAG':
        return <span className="bg-amber-500 text-white font-semibold text-xs px-2.5 py-1 rounded-full">⌛ REVISIÓN SAG</span>;
      case 'Revisión Aduana':
        return <span className="bg-blue-600 text-white font-semibold text-xs px-2.5 py-1 rounded-full">⌛ REVISIÓN ADUANA</span>;
      default:
        return <span className="bg-gray-400 text-white font-semibold text-xs px-2.5 py-1 rounded-full">EN REGISTRO</span>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      {/* Traveler Welcome Banner */}
      <div className="bg-[#004a99] text-white rounded-2xl p-6 shadow-md relative overflow-hidden" id="traveler-welcome-banner">
        <div className="relative z-10 space-y-2">
          <p className="text-blue-100 text-xs font-bold tracking-wider uppercase font-display">Portal del Viajero</p>
          <h1 className="text-2xl font-extrabold tracking-tight font-display">Bienvenido, {profile.fullName}</h1>
          <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-sm text-blue-100">
            <p><strong>Identificación:</strong> {profile.rutOrPassport}</p>
            <p><strong>Nacionalidad:</strong> {profile.nationality}</p>
            <p><strong>Expediente ID:</strong> <span className="font-mono text-xs bg-white/15 px-2 py-0.5 rounded">{tramite.id}</span></p>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 top-0 opacity-10 hidden md:block select-none pointer-events-none">
          <ClipboardList className="w-64 h-64 -mr-10 -mt-5" />
        </div>
      </div>

      {/* Main Grid cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Declaracion SAG */}
        <button
          type="button"
          onClick={() => onSelectAction('sag')}
          id="card-sag-declaration"
          className="bg-white hover:bg-slate-50/55 border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition duration-200 text-left flex gap-4 group cursor-pointer"
        >
          <div className="bg-emerald-50 group-hover:bg-emerald-100 text-emerald-700 p-4 rounded-xl transition self-start shrink-0">
            <Sprout className="w-8 h-8" />
          </div>
          <div className="flex-grow space-y-1.5">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-800 text-lg font-display">Declaración SAG</h2>
              {getSagBadge()}
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              Declare productos vegetales, animales, alimentos o mascotas que porte al ingresar al territorio nacional.
            </p>
            <span className="text-[#004a99] font-bold text-xs flex items-center gap-1 group-hover:translate-x-1 transition duration-200 pt-1 uppercase">
              Completar Formulario <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </button>

        {/* Declaracion PDI */}
        <button
          type="button"
          onClick={() => onSelectAction('pdi')}
          id="card-pdi-declaration"
          className="bg-white hover:bg-slate-50/55 border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition duration-200 text-left flex gap-4 group cursor-pointer"
        >
          <div className="bg-sky-50 group-hover:bg-sky-100 text-sky-700 p-4 rounded-xl transition self-start shrink-0">
            <UserSquare2 className="w-8 h-8" />
          </div>
          <div className="flex-grow space-y-1.5">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-800 text-lg font-display">Declaración PDI</h2>
              {getPdiBadge()}
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              Registre su país de origen, destino, motivo de viaje, tiempo de permanencia y documentos para control de migraciones.
            </p>
            <span className="text-[#004a99] font-bold text-xs flex items-center gap-1 group-hover:translate-x-1 transition duration-200 pt-1 uppercase">
              Completar Formulario <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </button>

        {/* Registro del Vehiculo */}
        <button
          type="button"
          onClick={() => onSelectAction('vehicle')}
          id="card-vehicle-registration"
          className="bg-white hover:bg-slate-50/55 border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition duration-200 text-left flex gap-4 group cursor-pointer"
        >
          <div className="bg-slate-100 group-hover:bg-slate-200 text-gray-700 p-4 rounded-xl transition self-start shrink-0">
            <Car className="w-8 h-8" />
          </div>
          <div className="flex-grow space-y-1.5">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-800 text-lg font-display">Registro del Vehículo</h2>
              {getVehicleBadge()}
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              Registre los datos técnicos de la patente, marca y modelo del automóvil en el cual ingresa al país o declare peatón.
            </p>
            <span className="text-[#004a99] font-bold text-xs flex items-center gap-1 group-hover:translate-x-1 transition duration-200 pt-1 uppercase">
              Completar Formulario <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </button>

        {/* Estado del Tramite */}
        <button
          type="button"
          onClick={() => onSelectAction('status')}
          id="card-tramite-status"
          className="bg-white hover:bg-slate-50/55 border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition duration-200 text-left flex gap-4 group cursor-pointer"
        >
          <div className="bg-blue-50 group-hover:bg-blue-100 text-blue-800 p-4 rounded-xl transition self-start shrink-0">
            <ClipboardList className="w-8 h-8" />
          </div>
          <div className="flex-grow space-y-1.5">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-800 text-lg font-display">Estado de mis Trámites</h2>
              {getGeneralStatusBadge()}
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              Consulte la línea de progreso en tiempo real de su revisión aduanera, aprobaciones del SAG y su resolución de ingreso final.
            </p>
            <span className="text-[#004a99] font-bold text-xs flex items-center gap-1 group-hover:translate-x-1 transition duration-200 pt-1 uppercase">
              Ver Línea de Tiempo <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </button>
      </div>

      {/* Quick guide card */}
      <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100 text-xs text-gray-600 space-y-1">
        <p className="font-bold text-[#004a99] uppercase tracking-wide">💡 Instrucciones para cruzar la frontera:</p>
        <p>1. Complete las tres secciones obligatorias: <strong>Declaración SAG</strong>, <strong>Declaración PDI</strong>, y <strong>Vehículo</strong>.</p>
        <p>2. Una vez completadas, su trámite pasará automáticamente al estado de <strong>Pendiente de revisión</strong> por las autoridades.</p>
        <p>3. Puede simular la aprobación cambiando al rol de <strong>Inspector SAG</strong> y luego a <strong>Funcionario de Aduana</strong> desde el menú de demostración superior.</p>
      </div>

      {/* Logout button */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={onLogout}
          id="btn-logout"
          className="flex items-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-800 font-bold px-4 py-2.5 rounded-lg transition text-xs uppercase tracking-wide cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}
