import { MaxFileSizeValidator as DefaultMaxFileSizeValidator } from '@nestjs/common';
import * as fs from 'fs';

export class MaxFileSizeCustomValidator extends DefaultMaxFileSizeValidator {
  isValid(fileOrFiles: Express.Multer.File | Express.Multer.File[]): boolean {
    if (Array.isArray(fileOrFiles)) {
      const files = fileOrFiles;
      if (!files.every((file) => super.isValid(file))) {
        for (const file of files) {
          fs.promises.unlink(file.path);
        }
      }
      return files.every((file) => super.isValid(file));
    }

    const file = fileOrFiles;
    if (!super.isValid) {
      fs.promises.unlink(file.path);
    }
    return super.isValid(file);
  }
}
