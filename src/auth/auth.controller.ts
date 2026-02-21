import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { userDto } from './dto/create.dto';
import { loginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Post('register')
  async createUser(@Body() dto:userDto)
  {
    console.log("hitt register");
     return await this.authService.register(dto);
  }


  @Post('login')
   async loginUser(@Body() dto:loginDto)
  {
     return await this.authService.login(dto);
  }

}
