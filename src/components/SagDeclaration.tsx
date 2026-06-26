/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sprout, CheckCircle2, ArrowLeft, HelpCircle } from 'lucide-react';
import { Tramite } from '../types';

interface SagDeclarationProps {
  tramite: Tramite;
  onSave: (sagData: Tramite['sag']) => void;
  onBack: () => void;
}

export default function SagDeclaration({ tramite, onSave, onBack }: SagDeclarationProps) {
  const [hasVegetables, setHasVegetables] = useState(tramite.sag.hasVegetables);
  const [vegetablesDesc, setVegetablesDesc] = useState(tramite.sag.vegetablesDesc);
  const [hasAnimals, setHasAnimals] = useState(tramite.sag.hasAnimals);
  const [animalsDesc, setAnimalsDesc] = useState(tramite.sag.animalsDesc);
  const [hasFood, setHasFood] = useState(tramite.sag.hasFood);
  const [foodDesc, setFoodDesc] = useState(tramite.sag.foodDesc);
  const [hasPets, setHasPets] = useState(tramite.sag.hasPets);
  const [petsDesc, setPetsDesc] = useState(tramite.sag.petsDesc);

  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (hasVegetables && !vegetablesDesc.trim()) {
      setError('Por favor describa los productos vegetales que porta.');
      return;
    }
    if (hasAnimals && !animalsDesc.trim()) {
      setError('Por favor describa los productos animales que porta.');
      return;
    }
    if (hasFood && !foodDesc.trim()) {
      setError('Por favor describa los alimentos que porta.');
      return;
    }
    if (hasPets && !petsDesc.trim()) {
      setError('Por favor describa las mascotas que porta.');
      return;
    }

    const updatedSag: Tramite['sag'] = {
      completed: true,
      hasVegetables,
      vegetablesDesc: hasVegetables ? vegetablesDesc : '',
      hasAnimals,
      animalsDesc: hasAnimals ? animalsDesc : '',
      hasFood,
      foodDesc: hasFood ? foodDesc : '',
      hasPets,
      petsDesc: hasPets ? petsDesc : '',
      status: 'Pendiente' // Reset status to Pending for inspector review
    };

    onSave(updatedSag);
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
          <h1 className="text-2xl font-extrabold text-slate-900 font-display uppercase tracking-tight">Declaración Jurada SAG</h1>
          <p className="text-slate-500 text-xs font-semibold tracking-wider uppercase">Servicio Agrícola y Ganadero de Chile</p>
        </div>
      </div>

      {showSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 animate-fade-in" id="success-sag-alert">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          <div>
            <p className="font-bold">Declaración enviada correctamente.</p>
            <p className="text-sm text-emerald-700/95">Los datos han sido registrados en su expediente de viaje.</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Info Box */}
        <div className="bg-amber-50/60 p-4 border-b border-slate-250 flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <div className="text-xs text-slate-700 leading-relaxed space-y-1">
            <p className="font-bold text-amber-950 uppercase tracking-wide font-display">📋 Declaración Obligatoria:</p>
            <p>
              De acuerdo con las leyes sanitarias del país, todo viajero que ingrese al territorio nacional debe declarar de manera veraz si porta productos o subproductos de origen vegetal o animal para evitar el ingreso de plagas y enfermedades. No declarar mercancías prohibidas arriesga multas severas.
            </p>
          </div>
        </div>

        <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg">
              <span className="font-bold">Error:</span> {error}
            </div>
          )}

          {/* ITEM 1: Productos Vegetales */}
          <div className="space-y-3 pb-5 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <span className="bg-emerald-50 text-emerald-700 w-2 h-2 rounded-full inline-block"></span>
                  1. ¿Lleva consigo plantas, partes de plantas, semillas, frutas o verduras frescas?
                </h3>
                <p className="text-xs text-gray-400 pl-4">Flores, tierra, plantas de jardín, bulbos, tubérculos, frutos secos sin procesar, etc.</p>
              </div>
              <div className="flex bg-slate-100 p-1 rounded-lg w-fit self-end">
                <button
                  type="button"
                  onClick={() => setHasVegetables(true)}
                  className={`px-4 py-1 text-xs font-bold rounded-md transition duration-150 cursor-pointer ${hasVegetables ? 'bg-[#004a99] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Sí
                </button>
                <button
                  type="button"
                  onClick={() => { setHasVegetables(false); setVegetablesDesc(''); }}
                  className={`px-4 py-1 text-xs font-bold rounded-md transition duration-150 cursor-pointer ${!hasVegetables ? 'bg-[#004a99] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  No
                </button>
              </div>
            </div>

            {hasVegetables && (
              <div className="pl-4 animate-fade-in space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider" htmlFor="veg-desc">
                  Detalle los productos vegetales a ingresar:
                </label>
                <textarea
                  id="veg-desc"
                  rows={2}
                  placeholder="Ej: 3 naranjas, una bolsa de almendras con cáscara..."
                  value={vegetablesDesc}
                  onChange={(e) => setVegetablesDesc(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#004a99] transition font-medium"
                ></textarea>
              </div>
            )}
          </div>

          {/* ITEM 2: Productos Animales */}
          <div className="space-y-3 pb-5 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <span className="bg-emerald-50 text-emerald-700 w-2 h-2 rounded-full inline-block"></span>
                  2. ¿Lleva consigo productos o subproductos de origen animal?
                </h3>
                <p className="text-xs text-gray-400 pl-4">Carnes frescas, embutidos, lácteos crudos, artesanías con plumas/huesos, pieles de animales, etc.</p>
              </div>
              <div className="flex bg-slate-100 p-1 rounded-lg w-fit self-end">
                <button
                  type="button"
                  onClick={() => setHasAnimals(true)}
                  className={`px-4 py-1 text-xs font-bold rounded-md transition duration-150 cursor-pointer ${hasAnimals ? 'bg-[#004a99] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Sí
                </button>
                <button
                  type="button"
                  onClick={() => { setHasAnimals(false); setAnimalsDesc(''); }}
                  className={`px-4 py-1 text-xs font-bold rounded-md transition duration-150 cursor-pointer ${!hasAnimals ? 'bg-[#004a99] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  No
                </button>
              </div>
            </div>

            {hasAnimals && (
              <div className="pl-4 animate-fade-in space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider" htmlFor="anim-desc">
                  Detalle los productos animales a ingresar:
                </label>
                <textarea
                  id="anim-desc"
                  rows={2}
                  placeholder="Ej: Queso fresco de cabra, salame casero..."
                  value={animalsDesc}
                  onChange={(e) => setAnimalsDesc(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#004a99] transition font-medium"
                ></textarea>
              </div>
            )}
          </div>

          {/* ITEM 3: Alimentos */}
          <div className="space-y-3 pb-5 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <span className="bg-emerald-50 text-emerald-700 w-2 h-2 rounded-full inline-block"></span>
                  3. ¿Lleva alimentos elaborados o raciones de viaje?
                </h3>
                <p className="text-xs text-gray-400 pl-4">Sandwiches, comida preparada, conservas caseras, miel de abejas, etc.</p>
              </div>
              <div className="flex bg-slate-100 p-1 rounded-lg w-fit self-end">
                <button
                  type="button"
                  onClick={() => setHasFood(true)}
                  className={`px-4 py-1 text-xs font-bold rounded-md transition duration-150 cursor-pointer ${hasFood ? 'bg-[#004a99] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Sí
                </button>
                <button
                  type="button"
                  onClick={() => { setHasFood(false); setFoodDesc(''); }}
                  className={`px-4 py-1 text-xs font-bold rounded-md transition duration-150 cursor-pointer ${!hasFood ? 'bg-[#004a99] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  No
                </button>
              </div>
            </div>

            {hasFood && (
              <div className="pl-4 animate-fade-in space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider" htmlFor="food-desc">
                  Detalle los alimentos que lleva consigo:
                </label>
                <textarea
                  id="food-desc"
                  rows={2}
                  placeholder="Ej: Tarro de miel artesanal, empanadas de carne..."
                  value={foodDesc}
                  onChange={(e) => setFoodDesc(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#004a99] transition font-medium"
                ></textarea>
              </div>
            )}
          </div>

          {/* ITEM 4: Mascotas */}
          <div className="space-y-3 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <span className="bg-emerald-50 text-emerald-700 w-2 h-2 rounded-full inline-block"></span>
                  4. ¿Ingresa con mascotas o animales vivos?
                </h3>
                <p className="text-xs text-gray-400 pl-4">Perros, gatos, aves, hurones, etc. (Requieren certificado veterinario).</p>
              </div>
              <div className="flex bg-slate-100 p-1 rounded-lg w-fit self-end">
                <button
                  type="button"
                  onClick={() => setHasPets(true)}
                  className={`px-4 py-1 text-xs font-bold rounded-md transition duration-150 cursor-pointer ${hasPets ? 'bg-[#004a99] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Sí
                </button>
                <button
                  type="button"
                  onClick={() => { setHasPets(false); setPetsDesc(''); }}
                  className={`px-4 py-1 text-xs font-bold rounded-md transition duration-150 cursor-pointer ${!hasPets ? 'bg-[#004a99] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  No
                </button>
              </div>
            </div>

            {hasPets && (
              <div className="pl-4 animate-fade-in space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider" htmlFor="pet-desc">
                  Detalle especie, raza y estado de vacunas de la mascota:
                </label>
                <textarea
                  id="pet-desc"
                  rows={2}
                  placeholder="Ej: Perro Labrador de 3 años, porta carnet sanitario al día..."
                  value={petsDesc}
                  onChange={(e) => setPetsDesc(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#004a99] transition font-medium"
                ></textarea>
              </div>
            )}
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
              id="btn-submit-sag"
              className="w-full sm:w-2/3 bg-[#004a99] hover:bg-[#003d80] text-white font-bold py-3.5 px-4 rounded-lg shadow-sm hover:shadow transition text-xs uppercase tracking-wide cursor-pointer font-display flex items-center justify-center gap-2"
            >
              <Sprout className="w-4 h-4" /> Enviar declaración
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
