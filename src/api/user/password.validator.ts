import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { ValidatePasswordUseCase } from '@domain/validate-password.use-case';

@ValidatorConstraint()
export class PasswordValidator implements ValidatorConstraintInterface {
  validate(password: string): boolean {
    return !ValidatePasswordUseCase.exec(password);
  }

  defaultMessage(args: ValidationArguments): string {
    return ValidatePasswordUseCase.exec(args.value);
  }
}
