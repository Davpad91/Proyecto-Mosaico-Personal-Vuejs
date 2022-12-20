import { Module } from './app';

export interface SessionTokens {
  accesstoken: string;
  refreshtoken: string;
}

export interface SessionAccessToken {
  accesstoken: string;
}

export interface ResponseMessage{
  message: string;
}

export interface User {
  _id: string;
  id: string;
  name: string;
  idCard: number;
  email: string;
  phone: number;
  password: string;
  position: string;
  nitEnterprise: number;
  repeatpassword: string;
  question1: string;
  question2: string;
  question3: string;
  question4: string;
  answer1: string;
  answer2: string;
  answer3: string;
  answer4: string;
  role: string;
}

export interface UserUpdate {
  id: any;
  phone?: number;
  question1?: string;
  question2?: string;
  question3?: string;
  question4?: string;
  answer1?: string;
  answer2?: string;
  answer3?: string;
  answer4?: string;
}

export interface Role {
  _id: string;
  id: string;
  name: string;
  description: string;
  hierarchy: number;
}

export interface Config {
  colorNav: string;
  colorItems: string;
  imageNavBar: string;
  tittleNavBar: string;
  modules: Module[];
}

export interface NewPassword {
  oldpassword: string;
  password: string;
}
