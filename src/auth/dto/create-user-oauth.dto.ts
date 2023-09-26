import {
  IsDefined,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { AuthProvider } from 'src/model/users/user.entity';

export class CreateUserOauthDto {
  @IsEmail()
  email: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(40)
  readonly firstName: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(40)
  readonly lastName: string;

  @IsEnum(AuthProvider)
  readonly provider: AuthProvider;

  @IsString()
  @IsNotEmpty()
  readonly providerId: string;
}
