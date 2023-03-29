import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { SignInDto } from '../../core/dto/sign-in.dto';
import { AuthResponse } from '../../core/interfaces/auth-response';
import { AuthService } from './auth.service';
import { SignUpDto } from '../../core/dto/sign-up.dto';
import { AuthGuard } from '../../core/guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-in')
  public signIn(@Body() body: SignInDto): Promise<AuthResponse> {
    return this.authService.signIn(body);
  }

  @Post('sign-up')
  public register(@Body() body: SignUpDto): Promise<AuthResponse> {
    return this.authService.register(body);
  }

  @Get('user')
  @UseGuards(AuthGuard)
  public getAuthUser(@Headers() headers): AuthResponse {
    return this.authService.getAuthUser(headers['authorization']);
  }
}
