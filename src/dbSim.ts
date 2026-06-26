/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TravelerProfile, Tramite, TramiteStatus, SystemProfile } from './types';
import { INITIAL_TRAVELERS, INITIAL_TRAMITES } from './mockData';

const KEY_TRAVELERS = 'aduana_travelers';
const KEY_TRAMITES = 'aduana_tramites';
const KEY_PROFILES = 'aduana_profiles';

const DEFAULT_PROFILES: SystemProfile[] = [
  {
    id: 'prof-1',
    fullName: 'Administrador General',
    email: 'admin@aduana.cl',
    password: 'password123',
    role: 'admin',
    status: 'Activo',
    dateCreated: '2026-06-25T10:00:00Z'
  },
  {
    id: 'prof-2',
    fullName: 'Claudio Almonacid',
    email: 'claudio.pdi@pdi.cl',
    password: 'password123',
    role: 'pdi',
    status: 'Activo',
    dateCreated: '2026-06-25T11:00:00Z'
  },
  {
    id: 'prof-3',
    fullName: 'Inspector SAG Central',
    email: 'sag@aduana.cl',
    password: 'password123',
    role: 'sag',
    status: 'Activo',
    dateCreated: '2026-06-25T12:00:00Z'
  },
  {
    id: 'prof-4',
    fullName: 'Funcionario Aduana Principal',
    email: 'aduana@aduana.cl',
    password: 'password123',
    role: 'aduana',
    status: 'Activo',
    dateCreated: '2026-06-25T13:00:00Z'
  }
];

export function initStorage(): void {
  if (!localStorage.getItem(KEY_TRAVELERS)) {
    localStorage.setItem(KEY_TRAVELERS, JSON.stringify(INITIAL_TRAVELERS));
  }
  if (!localStorage.getItem(KEY_TRAMITES)) {
    localStorage.setItem(KEY_TRAMITES, JSON.stringify(INITIAL_TRAMITES));
  }
  if (!localStorage.getItem(KEY_PROFILES)) {
    localStorage.setItem(KEY_PROFILES, JSON.stringify(DEFAULT_PROFILES));
  }
}

export function getProfiles(): SystemProfile[] {
  initStorage();
  const data = localStorage.getItem(KEY_PROFILES);
  return data ? JSON.parse(data) : [];
}

export function saveProfiles(profiles: SystemProfile[]): void {
  localStorage.setItem(KEY_PROFILES, JSON.stringify(profiles));
}

export function getTravelers(): TravelerProfile[] {
  initStorage();
  const data = localStorage.getItem(KEY_TRAVELERS);
  return data ? JSON.parse(data) : [];
}

export function saveTravelers(travelers: TravelerProfile[]): void {
  localStorage.setItem(KEY_TRAVELERS, JSON.stringify(travelers));
}

export function getTramites(): Tramite[] {
  initStorage();
  const data = localStorage.getItem(KEY_TRAMITES);
  return data ? JSON.parse(data) : [];
}

export function saveTramites(tramites: Tramite[]): void {
  localStorage.setItem(KEY_TRAMITES, JSON.stringify(tramites));
}

export function registerTraveler(profile: Omit<TravelerProfile, 'id'>): { success: boolean; error?: string; traveler?: TravelerProfile } {
  const travelers = getTravelers();
  
  // Check if rut or email already exists
  const existsEmail = travelers.some(t => t.email.toLowerCase() === profile.email.toLowerCase());
  const existsRut = travelers.some(t => t.rutOrPassport.replace(/[\s.-]/g, '').toLowerCase() === profile.rutOrPassport.replace(/[\s.-]/g, '').toLowerCase());

  if (existsEmail) {
    return { success: false, error: 'El correo electrónico ya está registrado.' };
  }
  if (existsRut) {
    return { success: false, error: 'El RUT o Pasaporte ya está registrado.' };
  }

  const newTraveler: TravelerProfile = {
    ...profile,
    id: `user-${Date.now()}`
  };

  travelers.push(newTraveler);
  saveTravelers(travelers);

  // Initialize a blank tramite for this new traveler
  const tramites = getTramites();
  const newTramite: Tramite = {
    id: `tramite-${Date.now()}`,
    travelerId: newTraveler.id,
    travelerName: newTraveler.fullName,
    travelerRut: newTraveler.rutOrPassport,
    travelerNationality: newTraveler.nationality,
    travelerEmail: newTraveler.email,
    travelerPhone: newTraveler.phone,
    sag: {
      completed: false,
      hasVegetables: false,
      vegetablesDesc: '',
      hasAnimals: false,
      animalsDesc: '',
      hasFood: false,
      foodDesc: '',
      hasPets: false,
      petsDesc: '',
      status: 'Pendiente'
    },
    pdi: {
      completed: false,
      originCountry: '',
      destinationCountry: 'Chile',
      travelReason: 'Turismo',
      stayDays: '',
      docType: 'RUT',
      docNumber: newTraveler.rutOrPassport
    },
    vehicle: {
      completed: false,
      registered: false,
      plate: '',
      brand: '',
      model: '',
      year: '',
      color: ''
    },
    status: 'Registro',
    docsStatus: 'Faltan documentos',
    dateCreated: new Date().toISOString()
  };

  tramites.push(newTramite);
  saveTramites(tramites);

  return { success: true, traveler: newTraveler };
}

export function getTramiteByTravelerId(travelerId: string): Tramite | undefined {
  const tramites = getTramites();
  return tramites.find(t => t.travelerId === travelerId);
}

export function updateTramite(tramite: Tramite): void {
  const tramites = getTramites();
  const index = tramites.findIndex(t => t.id === tramite.id);
  if (index !== -1) {
    tramites[index] = tramite;
    saveTramites(tramites);
  }
}

export function updateTramiteStatus(tramiteId: string, status: TramiteStatus): void {
  const tramites = getTramites();
  const index = tramites.findIndex(t => t.id === tramiteId);
  if (index !== -1) {
    tramites[index].status = status;
    saveTramites(tramites);
  }
}
