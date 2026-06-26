/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'viajero' | 'sag' | 'aduana';

export interface TravelerProfile {
  id: string;
  fullName: string;
  rutOrPassport: string;
  nationality: string;
  email: string;
  phone: string;
  password?: string;
}

export interface SagDeclarationType {
  completed: boolean;
  hasVegetables: boolean;
  vegetablesDesc: string;
  hasAnimals: boolean;
  animalsDesc: string;
  hasFood: boolean;
  foodDesc: string;
  hasPets: boolean;
  petsDesc: string;
  status: 'Pendiente' | 'Aprobado' | 'Rechazado' | 'Retenido';
  comments?: string;
}

export interface PdiDeclarationType {
  completed: boolean;
  originCountry: string;
  destinationCountry: string;
  travelReason: string;
  stayDays: string;
  docType: 'RUT' | 'Pasaporte' | 'DNI';
  docNumber: string;
}

export interface VehicleRegistrationType {
  completed: boolean;
  registered: boolean; // True if they chose to register a vehicle, false if they enter as a pedestrian
  plate: string;
  brand: string;
  model: string;
  year: string;
  color: string;
}

export type TramiteStatus = 
  | 'Registro' 
  | 'Declaración SAG' 
  | 'Declaración PDI' 
  | 'Vehículo' 
  | 'Revisión SAG' 
  | 'Revisión Aduana' 
  | 'Autorizado' 
  | 'Rechazado';

export interface Tramite {
  id: string;
  travelerId: string;
  travelerName: string;
  travelerRut: string;
  travelerNationality: string;
  travelerEmail: string;
  travelerPhone: string;
  sag: SagDeclarationType;
  pdi: PdiDeclarationType;
  vehicle: VehicleRegistrationType;
  status: TramiteStatus;
  docsStatus: 'Completa' | 'Faltan documentos' | 'Declaración aprobada' | 'Pendiente de revisión';
  finalDecisionReason?: string;
  dateCreated: string;
}
