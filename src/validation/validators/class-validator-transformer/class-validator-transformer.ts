import { plainToInstance } from 'class-transformer'
import { validateSync } from 'class-validator'
import { Validation } from '@/presentation/protocols'

export class AbstractClassValidator<T extends Object> implements Validation {
  private readonly dtoClass: new () => T
  private transformedInstance?: T

  constructor(dtoClass: new () => T) {
    this.dtoClass = dtoClass
  }

  validate(input: any): Error {
    const instance = plainToInstance(this.dtoClass, input)
    this.transformedInstance = instance

    const errors = validateSync(instance)
    if (errors.length > 0) {
      const messages = this.formatErrors(errors)
      return new Error(messages)
    }
  }

  getTransformed(): T | undefined {
    return this.transformedInstance
  }

  private formatErrors(errors: any[]): string {
    const extractMessages = (errs: any[]): string[] => {
      return errs.flatMap(err => {
        const messages: string[] = Object.values(err.constraints ?? {})

        if (err.children && err.children.length > 0) {
          return [...messages, ...extractMessages(err.children)]
        }

        return messages
      })
    }

    return extractMessages(errors).join('; ')
  }
}
