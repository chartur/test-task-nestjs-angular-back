import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../entities/user.entity';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    JwtModule.register({
      secret: 'AUTH_SECRET',
      signOptions: { expiresIn: '14d' },
    }),
    TypeOrmModule.forFeature([UserEntity]),
  ],
})
export class AuthModule {}
