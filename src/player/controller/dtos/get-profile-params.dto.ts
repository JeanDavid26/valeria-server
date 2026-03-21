import { IsNotEmpty, IsString, Length } from 'class-validator';

export class GetProfileParamsDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @Length(4, 4)
  tag: string;
}
