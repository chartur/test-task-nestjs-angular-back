import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from '../../entities/file.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../../entities/user.entity';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileEntity)
    private fileEntityRepository: Repository<FileEntity>,
    @InjectRepository(UserEntity)
    private userEntityRepository: Repository<UserEntity>,
  ) {}

  public async upload(
    user: UserEntity,
    file: Express.Multer.File,
  ): Promise<FileEntity> {
    const reloadedUser = await this.userEntityRepository.findOneOrFail({
      where: {
        id: user.id,
      },
      relations: ['files'],
    });

    const fileData = this.fileEntityRepository.create({
      name: file.filename,
      path: file.path,
      size: file.size,
    });

    const uploadedFile = await this.fileEntityRepository.save(fileData);
    reloadedUser.files.push(uploadedFile);
    await this.userEntityRepository.save(reloadedUser);
    return uploadedFile;
  }

  public getUserFiles(user: UserEntity): Promise<FileEntity[]> {
    return this.fileEntityRepository.find({
      where: {
        user: {
          id: user.id,
        },
      },
    });
  }
}
