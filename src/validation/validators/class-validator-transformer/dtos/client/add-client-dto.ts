import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { IsCPFOrCNPJ } from '@/validation/validators'

export class AddClientDto {
  @IsNotEmpty({ message: 'Missing param: name' })
  @IsString({ message: 'The "name" must be a string.' })
  name: string

  @IsNotEmpty({ message: 'Missing param: document' })
  @IsCPFOrCNPJ({ message: 'The "document" must be a valid CPF or CNPJ.' })
  document: string

  @IsOptional()
  @IsString({ message: 'The "email" must be a string.' })
  email?: string

  @IsOptional()
  @IsString({ message: 'The "phone" must be a string.' })
  phone?: string
}
