import { Config, Role } from './node';

export interface UserInfo {
  id: any;
  name: string;
  email: string;
  idCard: number;
  phone: number;
  question1: string;
  question2: string;
  question3: string;
  question4: string;
  hierarchy: number;
  nit: number;
  role: Role;
  config?: Config;
  notifications?: AppNotification[];
  nextAlert?: AppNotification;
  answer1?: string;
  answer2?: string;
  answer3?: string;
  answer4?: string;
}

export interface Module {
  id: number;
  title: string;
  icon: string;
  url: string;
  isActive: boolean;
}

export interface WebSocketResponse {
  user: string;
  id: string;
  data: any;
  method: string;
  date?: number;
  status?: number;
  flag?: boolean;
  error_name?: string;
  error_message?: string;
}

export interface AppNotification {
  id?: string | number;
  message: string;
  color: string;
  actions?: AppNotificationAction[];
  options?: AppNotificationOptions;
  date?: number;
}

export interface AppNotificationAction {
  label: string;
  color: string;
  handler: () => void;
}

export interface AppNotificationOptions {
  group?: boolean;
  progress?: boolean;
  caption?: string;
  position?:
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'center';
  textColor?: string;
  icon?: string;
  timeout?: number;
  html?: boolean;
}

export interface HierarchyDetail {
  value: number;
  icon_type: string;
  icon: string;
  color: string;
}
