import {
  Controller, Post, UploadedFile, UploadedFiles,
  UseGuards, UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('uploads')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
@Controller('uploads')
export class UploadsController {
  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a single file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return {
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      url: `/uploads/${file.filename}`,
    };
  }

  @Post('files')
  @UseInterceptors(FilesInterceptor('files', 5))
  @ApiOperation({ summary: 'Upload multiple files (max 5)' })
  @ApiConsumes('multipart/form-data')
  uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    return files.map((f) => ({
      filename: f.filename,
      originalname: f.originalname,
      mimetype: f.mimetype,
      size: f.size,
      url: `/uploads/${f.filename}`,
    }));
  }
}
