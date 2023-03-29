import {
  Controller, Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '../../core/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Uploader } from '../../utils/uploader';
import { DeleteUploadedFileOnErrorFilter } from '../../core/filters/delete-uploaded-file-on-error.filter';
import { AuthUser } from '../../core/decorators/auth-user.decorator';
import { UserEntity } from '../../entities/user.entity';
import { FileService } from './file.service';
import { FileEntity } from '../../entities/file.entity';

@Controller('file')
export class FileController {
  constructor(private fileService: FileService) {}

  @Get()
  @UseGuards(AuthGuard)
  public getUserFiles(@AuthUser() user: UserEntity): Promise<FileEntity[]> {
    return this.fileService.getUserFiles(user);
  }

  @Post('upload')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: Uploader.fileStore(() => './public/files'),
    }),
  )
  @UseFilters(DeleteUploadedFileOnErrorFilter)
  public upload(
    @AuthUser() user: UserEntity,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 5e6 })],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
  ): Promise<FileEntity> {
    return this.fileService.upload(user, file);
  }
}
