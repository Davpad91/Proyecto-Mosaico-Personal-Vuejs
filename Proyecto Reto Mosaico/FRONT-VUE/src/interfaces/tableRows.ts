import { HierarchyDetail } from './app';

export interface DeviceRow {
  id: number;
  device_name: string;
  os_name: string;
  brand: string;
  model: string;
  serial: string;
}

export interface RatingRow {
  id: number;
  user: string;
  grade: number;
  description: string;
  date: string;
  time: string;
}

export interface UserRow {
  id: string;
  name: string;
  idCard: number;
  email: string;
  phone: number;
  position: string;
}

export interface RoleRow {
  id: string;
  name: string;
  description: string;
  hierarchy: HierarchyDetail;
}
