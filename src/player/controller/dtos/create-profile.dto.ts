import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateProfileDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 20)
  username: string;
}
