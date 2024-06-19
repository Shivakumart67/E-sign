import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  InternalServerErrorException,
  Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Express } from 'express';
import { EsignService } from 'src/esign/services/esign/esign.service';

@Controller('esign')
export class EsignController {
  constructor(private zohoSignService: EsignService) {}
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // Specify the destination directory
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(pdf)$/)) {
          return callback(new Error('Only PDF files are allowed!'), false);
        }
        callback(null, true);
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      console.error('No file uploaded');
      throw new BadRequestException('No file uploaded');
    }
    try {
      console.log('File uploaded successfully:', file);
      return { filePath: file.path, file: file };
    } catch (error) {
      console.error('Error during file upload:', error);
      throw new InternalServerErrorException('File upload failed');
    }
  }

  @Get()
  getData() {
    return {
      message: 'success',
    };
  }

  @Post('zogoSign')
  async createAndSubmitDocument(): Promise<any> {
    return await this.zohoSignService.createAndSubmitDocument();
  }


}
