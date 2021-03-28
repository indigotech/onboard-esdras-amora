import { Service } from 'typedi';
import { ValidatePasswordUseCase } from '@domain/validate-password.use-case';
import { ServerError } from '@core/error/base.error';
import { StatusCode } from '@core/error/error.type';

@Service()
export class PasswordValidator {
  validate(password: string): void {
    const errorMessage = ValidatePasswordUseCase.exec(password);
    if (errorMessage) {
      throw new ServerError(StatusCode.BadRequest, errorMessage);
    }
  }
}
