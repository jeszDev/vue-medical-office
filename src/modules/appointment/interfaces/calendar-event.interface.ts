import type { Appointment } from './appointment.interface';

export interface CalendarEvent {
  e: E;
  event: Event;
}

export interface E {
  isTrusted: boolean;
  _vts: number;
}

export interface Event {
  start: Date;
  end: Date;
  title: string;
  appointment: Appointment;
  _: Empty;
  delete: null;
  isOverlapping: null;
  getOverlappingEvents: null;
}

export interface Empty {
  id: number;
  multiday: boolean;
  startFormatted: Date;
  endFormatted: Date;
  startMinutes: number;
  endMinutes: number;
  startTimeFormatted24: string;
  startTimeFormatted12: string;
  endTimeFormatted24: string;
  endTimeFormatted12: string;
  duration: number;
  deleting: boolean;
  deleted: boolean;
  register: null;
  cachedStart: number;
  cachedEnd: number;
  $el: null;
}
