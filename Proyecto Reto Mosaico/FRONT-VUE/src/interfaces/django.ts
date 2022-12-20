export interface Device {
  id: number;
  _id: number;
  user: string;
  device_name: string;
  os_name: string;
  os_version: string;
  nic_name: string;
  connection_type: string;
  ipv4: string;
  processor: string;
  ram: number;
  disk_type: number;
  disk_size: number;
  host_name: string;
  processor_quantity: number;
  brand: string;
  model: string;
  serial: string;
}

export interface Rating {
  id: number;
  _id: number;
  user: string;
  grade: number;
  description: string;
  date: string;
  time: string;
}
