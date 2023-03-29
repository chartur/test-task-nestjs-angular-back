import { UserEntity } from '../../entities/user.entity';

export interface AuthResponse {
  token: string;
  user: Omit<UserEntity, 'password' | 'hashPassword'>;
}
