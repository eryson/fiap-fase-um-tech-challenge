export interface Validation {
  validate: (input: any) => Error
  getTransformed?(): any
}
