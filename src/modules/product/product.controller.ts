import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiConsumes, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { JwtAuthGuard } from '../../guard/jwt-auth.guard';
import { Role } from '../../model/common/role.enum';
import { Roles } from '../../decorator/roles.decorator';
import { Product } from '../../model/entity/product.entity';
import { CreateProductDto } from '../../model/dto/product/create-product.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateProductImageParams } from './product-image/product-image.interface';
import { ExceptionMessageCode } from '../../exception/exception-message-codes.enum';
import { multerConfig } from '../../config/multer.config';

@ApiTags('products')
@Controller('products')
@UseGuards(JwtAuthGuard)
@Roles(Role.ADMIN)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiCreatedResponse()
  @ApiConsumes('multipart/form-data')
  @Post()
  @UseInterceptors(FilesInterceptor('images', undefined, multerConfig))
  async createProduct(
    @Body() body: CreateProductDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<Product> {
    if (!files) {
      throw new BadRequestException(
        ExceptionMessageCode.PRODUCT_IMAGES_REQUIRED,
      );
    }

    const images: Omit<CreateProductImageParams, 'productId'>[] =
      body.imageOrder.map((e) => {
        const imageFile = files?.find(
          (file) => file.originalname === e.imageFilename,
        );
        if (!imageFile) {
          throw new BadRequestException(
            ExceptionMessageCode.IMAGE_FILENAME_NOT_PRESENT,
          );
        }

        return {
          order: e.order,
          imagePath: imageFile.path,
        };
      });

    return this.productService.createProduct({
      ...body,
      images,
    });
  }
}
