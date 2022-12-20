import { reactive } from 'vue';
import { node } from '../../interfaces';

type PasswordValidator = {
  length: boolean;
  upper: boolean;
  number: boolean;
  symbol: boolean;
};

export const validPassword = reactive(<PasswordValidator>{
  length: false,
  upper: false,
  number: false,
  symbol: false,
});

export const validateEmail = (email: string): boolean => {
  return /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(email);
};

export const validatePassword = (
  password: string,
  user: node.User
): boolean => {
  if (user.password) validPassword.length = user.password.length >= 8;
  validPassword.upper = /^(?=.*[A-Z]).*$/.test(password);
  validPassword.number = /^(?=.*[0-9]).*$/.test(password);
  validPassword.symbol = /^(?=.*[!@#$%^&*()\-_+=]).*$/.test(password);

  return (
    validPassword.length &&
    validPassword.upper &&
    validPassword.number &&
    validPassword.symbol
  );
};
