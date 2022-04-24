import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProductService } from './product.service';
import { JwtAuthGuard } from '../../guard/jwt-auth.guard';
import { Permissions } from '../../decorator/roles.decorator';
import { Product } from '../../model/entity/product.entity';
import { CreateProductDto } from '../../model/dto/product/create-product.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateProductImageParams } from './product-image/product-image.interface';
import { ExceptionMessageCode } from '../../exception/exception-message-codes.enum';
import { multerConfig } from '../../config/multer.config';
import { UpdateProductDto } from '../../model/dto/product/update-product.dto';
import { GetProductsDto } from '../../model/dto/product/get-products.dto';
import { DataPageDto } from '../../model/dto/common/data-page.dto';
import { ApiFilesFormData } from '../../decorator/api-file.decorator';
import { ActionProduct } from '../../common/actions/product.action';

@ApiTags('products')
@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiCreatedResponse()
  @Post()
  @ApiFilesFormData('images')
  async createProduct(@Body() body: CreateProductDto): Promise<Product> {
    const images: Omit<CreateProductImageParams, 'productId'>[] =
      body.imageOrder.map((e) => {
        const imageFile = body.images?.find(
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

  @ApiOkResponse()
  @ApiConsumes('multipart/form-data')
  @HttpCode(HttpStatus.OK)
  @Patch('/:id')
  @UseInterceptors(FilesInterceptor('images', undefined, multerConfig))
  async updateProduct(
    @Param('id', ParseIntPipe) productId: number,
    @Body() body: UpdateProductDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<Product> {
    if (!files) {
      throw new BadRequestException(
        ExceptionMessageCode.PRODUCT_IMAGES_REQUIRED,
      );
    }

    const images: Omit<CreateProductImageParams, 'productId'>[] =
      body.imageOrder?.map((e) => {
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

    delete body.imageOrder;

    return this.productService.updateProduct(productId, {
      ...body,
      images,
    });
  }

  @ApiOkResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:id')
  async deleteProduct(
    @Param('id', ParseIntPipe) productId: number,
  ): Promise<void> {
    return this.productService.deleteProduct(productId);
  }

  @ApiOkResponse()
  @Get()
  @Permissions(ActionProduct.READ_ALL)
  async getProducts(
    @Query() query: GetProductsDto,
  ): Promise<DataPageDto<Product>> {
    return this.productService.getProducts(query);
  }

  @ApiOkResponse()
  @Get('/:id')
  async getProduct(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return this.productService.getProductById(id);
  }
}
