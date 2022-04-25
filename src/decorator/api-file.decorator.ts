import { extname } from 'path';
import { ApiConsumes, ApiProperty } from '@nestjs/swagger';
import {
  applyDecorators,
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Observable } from 'rxjs';

export const generateFileName = (req, file, callback) => {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);

  const fileExtName = extname(file.originalname);
  const fileName = `${uniqueSuffix}${fileExtName || '.jpg'}`;

  callback(null, fileName);
};

// export const ApiFileProperty =
//   (): PropertyDecorator => (target: unknown, propertyKey: string | symbol) => {
//     ApiProperty({
//       type: 'file',
//       properties: {
//         [propertyKey]: {
//           type: 'string',
//           format: 'binary',
//         },
//       },
//     })(target, propertyKey);
//   };

export const ApiFilesProperty =
  (params: { required?: boolean }): PropertyDecorator =>
  (target: unknown, propertyKey: string | symbol) => {
    ApiProperty({
      required: params.required ?? true,
      type: 'array',
      name: propertyKey.toString(),
      items: {
        type: 'string',
        format: 'binary',
      },
    })(target, propertyKey);
  };

export const ApiFilesFormData = (fieldName = 'files') => {
  return applyDecorators(
    ApiConsumes('multipart/form-data'),
    UseInterceptors(
      FilesInterceptor(fieldName, undefined, {
        storage: diskStorage({
          destination: './upload',
          filename: generateFileName,
        }),
      }),
      FilesToBodyInterceptor,
    ),
  );
};

export class FileToBodyInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();

    if (req.body && req.file?.fieldname) {
      const { fieldname } = req.file;

      if (!req.body[fieldname]) {
        req.body[fieldname] = req.file;
      }
    }

    return next.handle();
  }
}

export class FilesToBodyInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();

    if (req.body && req.files?.length && Array.isArray(req.files)) {
      const { fieldname } = req.files[0];

      if (!req.body[fieldname]) {
        req.body[fieldname] = req.files;
      }
    }

    return next.handle();
  }
}
