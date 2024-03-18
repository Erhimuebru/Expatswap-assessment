import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'complexity', async: false })
export class PasswordComplexityValidator implements ValidatorConstraintInterface {
  validate(password: string, args: ValidationArguments) {
    // Strong regular expression for password complexity
    const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*()_+{}\[\]:;<>,.?/~\\-]).{8,}$/;
    return passwordRegex.test(password);
  }

  defaultMessage(args: ValidationArguments) {
    return `Password must contain at least one lowercase letter, one uppercase letter, one number, one special character, and be at least 8 characters long`;
  }
}
