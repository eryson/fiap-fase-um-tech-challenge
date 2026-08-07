import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator'

const onlyDigits = (value: string): string => value.replace(/\D/g, '')

const calcCheckDigit = (base: string, weights: number[]): number => {
  const sum = base
    .split('')
    .reduce((acc, digit, index) => acc + Number(digit) * weights[index], 0)
  const rest = sum % 11
  return rest < 2 ? 0 : 11 - rest
}

const isValidCPF = (cpf: string): boolean => {
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false

  const base = cpf.slice(0, 9)
  const digit1 = calcCheckDigit(base, [10, 9, 8, 7, 6, 5, 4, 3, 2])
  const digit2 = calcCheckDigit(base + digit1, [11, 10, 9, 8, 7, 6, 5, 4, 3, 2])

  return cpf === `${base}${digit1}${digit2}`
}

const isValidCNPJ = (cnpj: string): boolean => {
  if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false

  const base = cnpj.slice(0, 12)
  const digit1 = calcCheckDigit(base, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2])
  const digit2 = calcCheckDigit(
    base + digit1,
    [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  )

  return cnpj === `${base}${digit1}${digit2}`
}

export const IsCPFOrCNPJ = (validationOptions?: ValidationOptions) => {
  return (object: object, propertyName: string): void => {
    registerDecorator({
      name: 'isCPFOrCNPJ',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown): boolean {
          if (typeof value !== 'string') return false
          const digits = onlyDigits(value)
          return isValidCPF(digits) || isValidCNPJ(digits)
        },
        defaultMessage(args: ValidationArguments): string {
          return `The "${args.property}" must be a valid CPF or CNPJ.`
        },
      },
    })
  }
}
