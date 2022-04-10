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
  UseGuards,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateCategoryDto } from '../../model/dto/category/create-category.dto';
import { Category } from '../../model/entity/category.entity';
import { CategoryService } from './category.service';
import { Roles } from '../../decorator/roles.decorator';
import { Role } from '../../model/common/role.enum';
import { GetCategoriesDto } from '../../model/dto/category/get-categories.dto';
import { DataPageDto } from '../../model/dto/common/data-page.dto';
import { UpdateCategoryDto } from '../../model/dto/category/update-category.dto';
import { JwtAuthGuard } from '../../guard/jwt-auth.guard';

@ApiTags('categories')
@Controller('categories')
@Roles(Role.ADMIN)
@UseGuards(JwtAuthGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiCreatedResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post()
  async createCategory(@Body() body: CreateCategoryDto): Promise<Category> {
    return this.categoryService.createCategory(body);
  }

  @ApiOkResponse()
  @Get()
  async getCategories(
    @Query() query: GetCategoriesDto,
  ): Promise<DataPageDto<Category>> {
    return this.categoryService.getCategories(query);
  }

  @ApiOkResponse()
  @Patch('/:id')
  async updateCategory(
    @Param('id', ParseIntPipe) categoryId: number,
    @Body() body: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.updateCategory(categoryId, body);
  }

  @ApiOkResponse()
  @Delete('/:id')
  async deleteCategory(
    @Param('id', ParseIntPipe) categoryId: number,
  ): Promise<void> {
    return this.categoryService.deleteCategory(categoryId);
  }
}
