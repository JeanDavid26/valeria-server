import { IsEmail, IsNotEmpty, IsString, Min } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Min(8)
  password: string;
}
