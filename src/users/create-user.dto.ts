import { IsEmail, MinLength } from 'class-validator';

export class CreateUserDto {
@IsEmail({}, { message: 'Некоректний формат Email' })
email: string;

@MinLength(8, { message: 'Пароль має бути не менше 8 символів' })
password: string;
}