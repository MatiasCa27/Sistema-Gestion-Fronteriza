/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TravelerProfile, Tramite } from './types';

export const INITIAL_TRAVELERS: TravelerProfile[] = [
  {
    id: 'user-1',
    fullName: 'Juan Pérez García',
    rutOrPassport: '12.345.678-9',
    nationality: 'Chilena',
    email: 'juan.perez@email.com',
    phone: '+56912345678',
    password: 'password123'
  },
  {
    id: 'user-2',
    fullName: 'María Silva Santos',
    rutOrPassport: '20.456.789-0',
    nationality: 'Brasileña',
    email: 'maria.silva@email.com',
    phone: '+5511987654321',
    password: 'password123'
  },
  {
    id: 'user-3',
    fullName: 'Hans Schmidt',
    rutOrPassport: 'G9847192',
    nationality: 'Alemana',
    email: 'hans.schmidt@email.com',
    phone: '+491761234567',
    password: 'password123'
  },
  {
    id: 'user-4',
    fullName: 'Clara Domínguez Vega',
    rutOrPassport: '18.765.432-1',
    nationality: 'Argentina',
    email: 'clara.dom@email.com',
    phone: '+5491123456789',
    password: 'password123'
  }
];

export const INITIAL_TRAMITES: Tramite[] = [
  {
    id: 'tramite-1',
    travelerId: 'user-1',
    travelerName: 'Juan Pérez García',
    travelerRut: '12.345.678-9',
    travelerNationality: 'Chilena',
    travelerEmail: 'juan.perez@email.com',
    travelerPhone: '+56912345678',
    sag: {
      completed: true,
      hasVegetables: true,
      vegetablesDesc: '3 manzanas rojas orgánicas y 1 bolsa de nueces sin procesar',
      hasAnimals: false,
      animalsDesc: '',
      hasFood: true,
      foodDesc: 'Queso artesanal de campo hecho en casa (leche cruda)',
      hasPets: false,
      petsDesc: '',
      status: 'Retenido',
      comments: 'Manzanas y queso artesanal sin pasteurizar retenidos por alto riesgo fitosanitario.'
    },
    pdi: {
      completed: true,
      originCountry: 'Argentina',
      destinationCountry: 'Chile',
      travelReason: 'Turismo',
      stayDays: '15',
      docType: 'RUT',
      docNumber: '12.345.678-9'
    },
    vehicle: {
      completed: true,
      registered: true,
      plate: 'AB-CD-12',
      brand: 'Toyota',
      model: 'RAV4',
      year: '2021',
      color: 'Gris Plata'
    },
    status: 'Rechazado',
    docsStatus: 'Completa',
    finalDecisionReason: 'Ingreso rechazado temporalmente. Se detectó transporte de productos lácteos crudos e insumos orgánicos prohibidos que no fueron autorizados por el inspector SAG y se negaron a ser destruidos en el depósito fronterizo.',
    dateCreated: '2026-06-25T14:30:00Z'
  },
  {
    id: 'tramite-2',
    travelerId: 'user-2',
    travelerName: 'María Silva Santos',
    travelerRut: '20.456.789-0',
    travelerNationality: 'Brasileña',
    travelerEmail: 'maria.silva@email.com',
    travelerPhone: '+5511987654321',
    sag: {
      completed: true,
      hasVegetables: false,
      vegetablesDesc: '',
      hasAnimals: false,
      animalsDesc: '',
      hasFood: false,
      foodDesc: '',
      hasPets: true,
      petsDesc: 'Un perro caniche (Poodle) con su certificado de vacunas y chip al día',
      status: 'Pendiente',
      comments: ''
    },
    pdi: {
      completed: true,
      originCountry: 'Brasil',
      destinationCountry: 'Chile',
      travelReason: 'Estudios',
      stayDays: '180',
      docType: 'Pasaporte',
      docNumber: 'BR543210'
    },
    vehicle: {
      completed: true,
      registered: false,
      plate: '',
      brand: '',
      model: '',
      year: '',
      color: ''
    },
    status: 'Revisión SAG',
    docsStatus: 'Pendiente de revisión',
    dateCreated: '2026-06-26T09:15:00Z'
  },
  {
    id: 'tramite-3',
    travelerId: 'user-3',
    travelerName: 'Hans Schmidt',
    travelerRut: 'G9847192',
    travelerNationality: 'Alemana',
    travelerEmail: 'hans.schmidt@email.com',
    travelerPhone: '+491761234567',
    sag: {
      completed: true,
      hasVegetables: false,
      vegetablesDesc: '',
      hasAnimals: false,
      animalsDesc: '',
      hasFood: false,
      foodDesc: '',
      hasPets: false,
      petsDesc: '',
      status: 'Aprobado',
      comments: 'Declaración negativa, no porta productos regulados.'
    },
    pdi: {
      completed: true,
      originCountry: 'Alemania',
      destinationCountry: 'Chile',
      travelReason: 'Turismo',
      stayDays: '30',
      docType: 'Pasaporte',
      docNumber: 'G9847192'
    },
    vehicle: {
      completed: true,
      registered: true,
      plate: 'K-HS-789',
      brand: 'BMW',
      model: 'X5',
      year: '2023',
      color: 'Negro'
    },
    status: 'Autorizado',
    docsStatus: 'Completa',
    finalDecisionReason: 'Ingreso autorizado. Documentación impecable, verificación vehicular aprobada y declaración de sanidad vegetal/animal negativa.',
    dateCreated: '2026-06-24T11:00:00Z'
  },
  {
    id: 'tramite-4',
    travelerId: 'user-4',
    travelerName: 'Clara Domínguez Vega',
    travelerRut: '18.765.432-1',
    travelerNationality: 'Argentina',
    travelerEmail: 'clara.dom@email.com',
    travelerPhone: '+5491123456789',
    sag: {
      completed: true,
      hasVegetables: false,
      vegetablesDesc: '',
      hasAnimals: false,
      animalsDesc: '',
      hasFood: true,
      foodDesc: 'Galletas envasadas de chocolate comercialmente selladas',
      hasPets: false,
      petsDesc: '',
      status: 'Aprobado',
      comments: 'Alimentos envasados comerciales autorizados.'
    },
    pdi: {
      completed: true,
      originCountry: 'Argentina',
      destinationCountry: 'Chile',
      travelReason: 'Trabajo',
      stayDays: '5',
      docType: 'DNI',
      docNumber: '18.765.432-1'
    },
    vehicle: {
      completed: true,
      registered: true,
      plate: 'AA-432-BB',
      brand: 'Ford',
      model: 'Focus',
      year: '2020',
      color: 'Azul Marino'
    },
    status: 'Revisión Aduana',
    docsStatus: 'Declaración aprobada',
    dateCreated: '2026-06-26T11:45:00Z'
  }
];
