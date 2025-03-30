import { IsEmail, Min, MinLength } from 'class-validator';

export default class CreateUserDto {
  @MinLength(2, {
    message: 'Tên phải từ 2 ký tự',
  })
  name: string;
  @MinLength(1, {
    message: 'Vui lòng nhập email',
  })
  @IsEmail(
    {},
    {
      message: 'Email không đúng định dạng',
    },
  )
  email: string;
  @MinLength(6, {
    message: 'Mật khẩu phải từ 6 ký tự',
  })
  password: string;
}
