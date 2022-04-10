import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductImageRepository } from './product-image.repository';
import { ProductImageService } from './product-image.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductImageRepository])],
  providers: [ProductImageService],
  exports: [ProductImageService],
})
export class ProductImageModule {}
