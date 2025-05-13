import identity from "./includes/identity";
import instructions from "./includes/instructions";

export default `
${identity}

${instructions}

## Tarea
- Genera el nombre que va a tener el módulo que sería el nombre de la entidad en **Kebab Case**
  por ejemplo si el nombre de la entidad es "CategoryProduct" el nombre del módulo sería "category-product"
- Crear la clase controladora.
- Crear el servicio.
- Crear el módulo.
- Devolver un respuesta que permita llamar a la tool "create_file", pasando los parámetros "path" y "content".
- Ajustarse exactamente al path donde se debe poner cada fichero.

# Ejemplos

# Example 1

Crear un módulo para la entidad *Category*

<user_query>
Class Category
name string
description string optional
isActive boolean
order number
</user_query>

Crear la clase controladora

<call_function id="controller-class" name="create_file" parameters={
  "path": "src/modules/category/category.controller.ts",
  "content": "import { Controller, Get, Post, Body, Patch, Delete } from '@nestjs/common';
import { Audit, COMMON_EVENTS } from '@dfl-nest/audit';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { Category } from './entities';
import { AppendOwnerAndSpace, Auth, SpaceSecure } from '@dfl-nest/security';
import {
  ApiCreate,
  ApiUpdate,
  ApiGetOne,
  ApiDeleteOne,
  ApiSearch,
  GetFilter,
  FilterByParamId,
  FilterSpace,
  FilterSoftDelete,
  FilterBody,
  SearchBody,
} from '@dfl-nest/common';
import { ApiTags } from '@nestjs/swagger';
import { IFilter } from '@dofleini/query-builder';
import { CATEGORY_PERMISSIONS, CATEGORY_MODULE } from './constants';


@ApiTags('Category')
@Auth(CATEGORY_PERMISSIONS.VIEW)
@SpaceSecure()
@FilterSpace()
@FilterSoftDelete()
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @Audit({ module: CATEGORY_MODULE, event: COMMON_EVENTS.CREATE, saveResponse: true })
  @AppendOwnerAndSpace()
  @Auth(CATEGORY_PERMISSIONS.WRITE)
  @ApiCreate('Category', CreateCategoryDto, Category)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Post('search')
  @FilterBody()
  @ApiSearch('Category', Category)
  findAll(@Body() options: SearchBody, @GetFilter() filter: IFilter) {
    return this.categoryService.search(filter, options);
  }

  @Get(':id')
  @FilterByParamId()
  @ApiGetOne('Category', 'id', Category, { mongoId: true })
  findOne(@GetFilter() filter: IFilter) {
    return this.categoryService.findOne(filter);
  }

  @Patch(':id')
  @Audit({ module: CATEGORY_MODULE, event: COMMON_EVENTS.UPDATE , saveResponse: true })
  @FilterByParamId()
  @Auth(CATEGORY_PERMISSIONS.WRITE)
  @ApiUpdate('Category', UpdateCategoryDto, Category, { mongoId: true })
  update(@GetFilter() filter: IFilter, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.findOneAndUpdate(filter, updateCategoryDto);
  }

  @Delete(':id')
  @Audit({ module: CATEGORY_MODULE, event: COMMON_EVENTS.DELETED })
  @FilterByParamId()
  @Auth(CATEGORY_PERMISSIONS.WRITE)
  @ApiDeleteOne('Category', 'id', null, { mongoId: true })
  remove(@GetFilter() filter: IFilter) {
    return this.categoryService.remove(filter);
  }
}
"
} />

Crear la clase service

<call_function id="service-class" name="create_file" parameters={
  "path": "src/modules/category/category.service.ts",
  "content": "import { Injectable } from '@nestjs/common';
import { EntityService, SearchByRegex, SoftDelete } from '@dfl-nest/mongodb';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { Category } from './entities';
import { ConfigService } from '@nestjs/config';

@Injectable()
@SoftDelete()
@SearchByRegex('name', 'description')
export class CategoryService extends EntityService<
  Category,
  CreateCategoryDto,
  UpdateCategoryDto
> {
  constructor(
    @InjectModel(Category.name)
    private readonly category: Model<Category>,
    protected readonly configService: ConfigService,
  ) {
    super(category, configService);
  }
}
"
} />

Crear el módulo

<call_function id="module-class" name="create_file" parameters={
  "path": "src/modules/category/category.module.ts",
  "content": "import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './entities';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Category.name,
        schema: CategorySchema,
      },
    ]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
"
} />
`;
