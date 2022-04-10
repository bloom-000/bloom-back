import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import * as path from 'path';

export const multerConfig: MulterOptions = {
  storage: diskStorage({
    destination: './upload',
    filename: (_, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);

      const fileExtName = path.extname(file.originalname);
      const fileName = `${uniqueSuffix}${fileExtName}`;

      callback(null, fileName);
    },
  }),
};
