import { AbstractClassValidator, AddClientDto } from '@/validation/validators'

export const makeAddClientValidation =
  (): AbstractClassValidator<AddClientDto> => {
    return new AbstractClassValidator(AddClientDto)
  }
