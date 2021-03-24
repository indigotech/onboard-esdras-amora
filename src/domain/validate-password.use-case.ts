import { PASSWORD_MIN_LENGTH } from './constants';

function hasDigit(value?: string): boolean {
  return value?.search(/\d/) !== -1;
}

function hasLetter(value?: string): boolean {
  return value?.search(/[a-zA-Z]/) !== -1;
}

function hasValidLength(value?: string): boolean {
  const length = value?.length || 0;
  return length >= PASSWORD_MIN_LENGTH;
}

function validate(value?: string): string {
  if (!hasValidLength(value)) {
    return 'user.error.password.too-short';
  }

  if (!hasDigit(value)) {
    return 'user.error.password.no-digit';
  }

  if (!hasLetter(value)) {
    return 'user.error.password.no-letter';
  }

  return '';
}

export const ValidatePasswordUseCase = {
  exec: validate,
};
