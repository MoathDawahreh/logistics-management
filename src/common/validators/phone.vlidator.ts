import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'phoneStartsWith', async: false })
export class PhoneStartsWithConstraint implements ValidatorConstraintInterface {
  validate(value: string, _args: ValidationArguments) {
    return value?.startsWith('+962') && value.length === 13;
  }

  defaultMessage(_args: ValidationArguments) {
    return 'The phone number must start with +962 and have exactly 12 digits!';
  }
}

export function PhoneStartsWith(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: PhoneStartsWithConstraint,
    });
  };
}
