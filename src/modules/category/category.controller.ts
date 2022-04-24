import {
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
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateCategoryDto } from '../../model/dto/category/create-category.dto';
import { Category } from '../../model/entity/category.entity';
import { CategoryService } from './category.service';
import { GetCategoriesDto } from '../../model/dto/category/get-categories.dto';
import { DataPageDto } from '../../model/dto/common/data-page.dto';
import { UpdateCategoryDto } from '../../model/dto/category/update-category.dto';
import { Permissions } from '../../decorator/permissions.decorator';
import { ActionCategory } from '../../common/actions/category.action';

@ApiTags('categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiCreatedResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post()
  @Permissions(ActionCategory.CREATE)
  async createCategory(@Body() body: CreateCategoryDto): Promise<Category> {
    return this.categoryService.createCategory(body);
  }

  @ApiOkResponse()
  @Get()
  @Permissions(ActionCategory.READ_FILTER)
  async getCategories(
    @Query() query: GetCategoriesDto,
  ): Promise<DataPageDto<Category>> {
    return this.categoryService.getCategories(query);
  }

  @ApiOkResponse()
  @Get('/all')
  @Permissions(ActionCategory.READ_ALL)
  async getAllCategories(): Promise<Category[]> {
    return this.categoryService.getAllCategories();
  }

  @ApiOkResponse()
  @Get('/:id')
  @Permissions(ActionCategory.READ_BY_ID)
  async getCategory(@Param('id', ParseIntPipe) id: number): Promise<Category> {
    return this.categoryService.getCategory(id);
  }

  @ApiOkResponse()
  @Patch('/:id')
  @Permissions(ActionCategory.UPDATE)
  async updateCategory(
    @Param('id', ParseIntPipe) categoryId: number,
    @Body() body: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.updateCategory(categoryId, body);
  }

  @ApiOkResponse()
  @Delete('/:id')
  @Permissions(ActionCategory.DELETE)
  async deleteCategory(
    @Param('id', ParseIntPipe) categoryId: number,
  ): Promise<void> {
    return this.categoryService.deleteCategory(categoryId);
  }
}
