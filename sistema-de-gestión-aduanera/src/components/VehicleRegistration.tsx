/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Car, CheckCircle2, ArrowLeft, Footprints } from 'lucide-react';
import { Tramite } from '../types';

interface VehicleRegistrationProps {
  tramite: Tramite;
  onSave: (vehicleData: Tramite['vehicle']) => void;
  onBack: () => void;
}

export default function VehicleRegistration({ tramite, onSave, onBack }: VehicleRegistrationProps) {
  const [isPedestrian, setIsPedestrian] = useState(tramite.vehicle.completed && !tramite.vehicle.registered);
  const [plate, setPlate] = useState(tramite.vehicle.plate || '');
  const [brand, setBrand] = useState(tramite.vehicle.brand || '');
  const [model, setModel] = useState(tramite.vehicle.model || '');
  const [year, setYear] = useState(tramite.vehicle.year || '');
  const [color, setColor] = useState(tramite.vehicle.color || '');

  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isPedestrian) {
      if (!plate.trim()) {
        setError('Por favor ingrese la patente del vehículo.');
        return;
      }
      if (!brand.trim()) {
        setError('Por favor ingrese la marca del vehículo.');
        return;
      }
      if (!model.trim()) {
        setError('Por favor ingrese el modelo del vehículo.');
        return;
      }
      if (!year.trim() || isNaN(Number(year)) || Number(year) < 1900 || Number(year) > 2027) {
        setError('Por favor ingrese un año de fabricación válido.');
        return;
      }
      if (!color.trim()) {
        setError('Por favor ingrese el color del vehículo.');
        return;
      }
    }

    const updatedVehicle: Tramite['vehicle'] = {
      completed: true,
      registered: !isPedestrian,
      plate: isPedestrian ? '' : plate.toUpperCase(),
      brand: isPedestrian ? '' : brand,
      model: isPedestrian ? '' : model,
      year: isPedestrian ? '' : year,
      color: isPedestrian ? '' : color
    };

    onSave(updatedVehicle);
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
          <h1 className="text-2xl font-extrabold text-slate-900 font-display uppercase tracking-tight">Registro de Vehículo</h1>
          <p className="text-slate-500 text-xs font-semibold tracking-wider uppercase">Control e ingreso vehicular temporal o definitivo</p>
        </div>
      </div>

      {showSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 animate-fade-in" id="success-vehicle-alert">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          <div>
            <p className="font-bold">Vehículo registrado correctamente.</p>
            <p className="text-sm text-emerald-700/95">Los datos de transporte han sido actualizados en su expediente.</p>
          </div>
        </div>
      )}

      {/* Mode selection cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => setIsPedestrian(false)}
          className={`p-5 rounded-2xl border text-left flex gap-4 transition cursor-pointer duration-150 ${!isPedestrian ? 'bg-blue-50/30 border-[#004a99] shadow-sm ring-1 ring-[#004a99]' : 'bg-white border-slate-200 hover:border-slate-300'}`}
        >
          <div className={`p-3 rounded-xl ${!isPedestrian ? 'bg-blue-100 text-[#004a99]' : 'bg-slate-100 text-slate-500'}`}>
            <Car className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm font-display uppercase tracking-wide">Vehículo Motorizado</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">Ingreso en automóvil de pasajeros, camioneta, moto u otro transporte particular.</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => { setIsPedestrian(true); setError(''); }}
          className={`p-5 rounded-2xl border text-left flex gap-4 transition cursor-pointer duration-150 ${isPedestrian ? 'bg-blue-50/30 border-[#004a99] shadow-sm ring-1 ring-[#004a99]' : 'bg-white border-slate-200 hover:border-slate-300'}`}
        >
          <div className={`p-3 rounded-xl ${isPedestrian ? 'bg-blue-100 text-[#004a99]' : 'bg-slate-100 text-slate-500'}`}>
            <Footprints className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm font-display uppercase tracking-wide">Peatón / Pasajero</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">Ingreso cruzando a pie, en autobús comercial de pasajeros o servicio de transbordo público.</p>
          </div>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
        {isPedestrian ? (
          <div className="p-8 text-center space-y-4">
            <div className="mx-auto bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center text-[#004a99]">
              <Footprints className="w-8 h-8" />
            </div>
            <div className="max-w-md mx-auto space-y-1.5">
              <h3 className="font-bold text-slate-900 font-display uppercase tracking-wide">Usted ingresa como Peatón</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                No necesita ingresar patente ni especificaciones del vehículo. Al enviar, se registrará de inmediato su modalidad de ingreso peatonal o como pasajero de bus comercial.
              </p>
            </div>
            <div className="pt-4 flex justify-center gap-3">
              <button
                type="button"
                onClick={onBack}
                className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-3 px-6 rounded-lg border border-slate-250 transition text-xs uppercase tracking-wide cursor-pointer font-display"
              >
                Volver
              </button>
              <button
                type="button"
                onClick={handleFormSubmit}
                id="btn-confirm-pedestrian"
                className="bg-[#004a99] hover:bg-[#003d80] text-white font-bold py-3 px-6 rounded-lg shadow-sm hover:shadow transition text-xs uppercase tracking-wide cursor-pointer font-display"
              >
                Registrar Ingreso Peatonal
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleFormSubmit} className="p-6 space-y-5" id="vehicle-form">
            {error && (
              <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg">
                <span className="font-bold">Error:</span> {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Patente */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1" htmlFor="veh-plate">
                  Patente (Placa Vehicular)
                </label>
                <input
                  id="veh-plate"
                  type="text"
                  required
                  placeholder="Ej: ABCD-12 o AA-123-BB"
                  value={plate}
                  onChange={(e) => setPlate(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#004a99] transition font-mono font-bold"
                />
              </div>

              {/* Marca */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1" htmlFor="veh-brand">
                  Marca
                </label>
                <input
                  id="veh-brand"
                  type="text"
                  required
                  placeholder="Ej: Toyota, Ford, Hyundai..."
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#004a99] transition font-medium"
                />
              </div>

              {/* Modelo */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1" htmlFor="veh-model">
                  Modelo
                </label>
                <input
                  id="veh-model"
                  type="text"
                  required
                  placeholder="Ej: Rav4, Focus, Accent..."
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#004a99] transition font-medium"
                />
              </div>

              {/* Año */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1" htmlFor="veh-year">
                  Año
                </label>
                <input
                  id="veh-year"
                  type="number"
                  required
                  min="1900"
                  max="2027"
                  placeholder="Ej: 2021"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#004a99] transition font-medium"
                />
              </div>

              {/* Color */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1" htmlFor="veh-color">
                  Color
                </label>
                <input
                  id="veh-color"
                  type="text"
                  required
                  placeholder="Ej: Gris Plata, Rojo Cereza, Blanco Perla..."
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#004a99] transition font-medium"
                />
              </div>
            </div>

            {/* Submit and cancel */}
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
                id="btn-register-vehicle"
                className="w-full sm:w-2/3 bg-[#004a99] hover:bg-[#003d80] text-white font-bold py-3.5 px-4 rounded-lg shadow-sm hover:shadow transition text-xs uppercase tracking-wide cursor-pointer font-display flex items-center justify-center gap-2"
              >
                <Car className="w-4 h-4" /> Registrar Vehículo
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
