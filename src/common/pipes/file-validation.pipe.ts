import {
  PipeTransform,
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  async transform(file: any) {
    try {
      // const file = value?.file;
      console.log('--->', file.mimetype, file.size);
      if (!file) {
        throw new BadRequestException('No file uploaded');
      }

      // Validate file size (max 10 MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new BadRequestException('File size exceeds the limit of 10 MB');
      }

      // Validate file type (only images and PDFs are allowed)
      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/pdf',
        'application/json',
        //allow pdf
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      if (
        !allowedTypes.includes(file.mimetype) &&
        !file.mimetype.startsWith('video/')
      ) {
        throw new BadRequestException('Invalid file type!');
      }

      return file;
    } catch (error) {
      throw new InternalServerErrorException({ message: error });
    }
  }
}
