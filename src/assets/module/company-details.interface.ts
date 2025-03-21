export interface Contact {
  id?: string;
  name: string;
  position?: string;
  email?: string;
  phone?: string;
  notes?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface Project {
  id?: string;
  name: string;
  status: 'geplant' | 'aktiv' | 'pausiert' | 'abgeschlossen';
  startDatum: Date;
  endDatum?: Date;
  budget?: number;
  beschreibung: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface Activity {
  id?: string;
  typ: 'anruf' | 'meeting' | 'email' | 'notiz';
  datum: Date;
  kontaktPerson?: string;
  beschreibung: string;
  ergebnis?: string;
  createdAt?: any;
  updatedAt?: any;
} 