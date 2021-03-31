import { Service } from 'typedi';
import { ValidatePasswordUseCase } from '@domain/validate-password.use-case';
import { ServerError } from '@core/error/base.error';
import { StatusCode } from '@core/error/error.type';
import { LocalizationService } from '@core/localization';

@Service()
export class PasswordValidator {
  constructor(private readonly locale: LocalizationService) {}

  validate(password: string): void {
    const errorMessage = ValidatePasswordUseCase.exec(password);
    if (errorMessage) {
      throw new ServerError(StatusCode.BadRequest, this.locale.__(errorMessage));
    }
  }
}
