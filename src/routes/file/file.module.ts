import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from '../../entities/file.entity';
import { JwtModule } from '@nestjs/jwt';
import { UserEntity } from '../../entities/user.entity';

@Module({
  controllers: [FileController],
  providers: [FileService],
  imports: [
    JwtModule.register({
      secret: 'AUTH_SECRET',
      signOptions: { expiresIn: '14d' },
    }),
    TypeOrmModule.forFeature([FileEntity, UserEntity]),
  ],
})
export class FileModule {}
