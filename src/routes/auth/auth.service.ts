import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInDto } from '../../core/dto/sign-in.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { promisify } from 'util';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthResponse } from '../../core/interfaces/auth-response';
const bcryptComparePromise = promisify(bcrypt.compare);

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userEntityRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  public async signIn(body: SignInDto): Promise<AuthResponse> {
    const user = await this.userEntityRepository.findOneOrFail({
      where: {
        username: body.username,
      },
    });

    const verified = await bcryptComparePromise(body.password, user.password);

    if (!verified) {
      throw new UnauthorizedException();
    }

    const { password, ...payload } = user;

    return {
      token: this.jwtService.sign(payload),
      user: payload,
    };
  }

  public async register(body: SignInDto): Promise<AuthResponse> {
    const user = await this.userEntityRepository.create(body);
    await this.userEntityRepository.save(user);
    const { password, ...payload } = user;
    return {
      token: this.jwtService.sign(payload),
      user: payload,
    };
  }

  public getAuthUser(token: string): AuthResponse {
    const parsedToken = token.replace('Bearer ', '');
    const verified = this.jwtService.verify(parsedToken);
    return {
      user: verified,
      token: parsedToken,
    };
  }
}
