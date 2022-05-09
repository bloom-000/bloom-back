import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { Permissions } from '../../decorator/permissions.decorator';
import { Product } from '../../model/entity/product.entity';
import { CreateProductDto } from '../../model/dto/product/create-product.dto';
import { CreateProductImageParams } from './product-image/product-image.interface';
import { ExceptionMessageCode } from '../../common/exception-message-code.enum';
import { UpdateProductDto } from '../../model/dto/product/update-product.dto';
import { GetProductsDto } from '../../model/dto/product/get-products.dto';
import { DataPageDto } from '../../model/dto/common/data-page.dto';
import { ApiFilesFormData } from '../../decorator/api-file.decorator';
import { ActionProduct } from '../../common/actions/product.action';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiCreatedResponse()
  @Post()
  @ApiFilesFormData('images')
  @Permissions(ActionProduct.CREATE)
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
  @HttpCode(HttpStatus.OK)
  @ApiFilesFormData('images')
  @Patch('/:id')
  @Permissions(ActionProduct.UPDATE)
  async updateProduct(
    @Param('id') productId: string,
    @Body() body: UpdateProductDto,
  ): Promise<Product> {
    const images: Omit<CreateProductImageParams, 'productId'>[] =
      body.imageOrder?.map((e) => {
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

    delete body.imageOrder;

    return this.productService.updateProduct(productId, {
      ...body,
      images,
    });
  }

  @ApiOkResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:id')
  @Permissions(ActionProduct.DELETE)
  async deleteProduct(@Param('id') productId: string): Promise<void> {
    return this.productService.deleteProduct(productId);
  }

  @ApiOkResponse()
  @Get()
  async getProducts(
    @Query() query: GetProductsDto,
  ): Promise<DataPageDto<Product>> {
    return this.productService.getProducts(query);
  }

  @ApiOkResponse()
  @Get('/:id')
  @Permissions(ActionProduct.READ_BY_ID)
  async getProduct(@Param('id') id: string): Promise<Product> {
    return this.productService.getProductById(id);
  }

  @ApiOkResponse()
  @Get('/promoted')
  async getPromotedProducts(): Promise<Product[]> {
    return this.productService.getPromotedProducts();
  }
}
