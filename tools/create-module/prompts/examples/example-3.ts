export default `
# Example 3

Crear un módulo para la entidad *Person*

Aquí se pone un ejemplo de como generar una clase que tiene dos subdocumentos uno es un array y el otro es un campo directo.

<user_query>
class Person
name string required
parent required subdocument Parent
subjects array of subdocument Subject

class Parent
name string required

class Subject
name string required
points number required
</user_query>

<call_function id="entity-class" name="create_file" parameters={
  "path": "src/modules/person/entities/person.entity.ts",
  "content": "import { schemaOptions, DomainSchema } from '@dfl-nest/mongodb';
import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ParentScheme } from './parent.schema';
import { SubjectScheme } from './subject.schema';

@Schema(schemaOptions)
export class Person extends DomainSchema {
  @ApiProperty()
  @Prop()
  name: string;

  @ApiProperty()
  @Prop({ type: ParentScheme })
  parent: ParentScheme;

  @ApiProperty()
  @Prop([{ type: SubjectScheme }])
  subjects: SubjectScheme[];
}

export const PersonSchema = SchemaFactory.createForClass(Person);
PersonSchema.index({ createdAt: 1 })
PersonSchema.index({ space: 1, deleted: 1 })
"
} />

<call_function id="parent-class" name="create_file" parameters={
  "path": "src/modules/person/entities/parent.schema.ts",
  "content": "import { Prop, Schema } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ _id: false })
export class ParentSchema {
  @ApiProperty()
  @Prop({ required: true })
  name: string;
}
"
} />

<call_function id="subject-class" name="create_file" parameters={
  "path": "src/modules/person/entities/subject.schema.ts",
  "content": "import { Prop, Schema } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ _id: false })
export class SubjectSchema {
  @ApiProperty()
  @Prop({ required: true })
  name: string;

  @ApiProperty()
  @Prop({ required: true })
  points: number;
}
"
} />

<call_function id="index" name="create_file" parameters={
  "path": "src/modules/person/entities/index.ts",
  "content": "export * from './person.entity';
export * from './parent.schema';
export * from './subject.schema';
"
} />

Crear las clases dto

<call_function id="entity-dto" name="create_file" parameters={
  "path": "src/modules/person/dto/create-person.dto.ts",
  "content": "import { DomainDto } from '@dfl-nest/mongodb';
import {
  IsString,
  IsOptional,
  IsDefined,
  IsNotEmptyObject,
  IsObject,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ParentDto } from './parent.dto';
import { SubjectDto } from './subject.dto';

export class CreatePersonDto extends DomainDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ type: () => ParentDto })
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @Type(() => ParentDto)
  @ValidateNested()
  parent: ParentDto;

  @IsArray()
  @IsObject({ each: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SubjectDto)
  subjects: SubjectDto[];
}
"
} />

<call_function id="parent-dto" name="create_file" parameters={
  "path": "src/modules/person/dto/parent.dto.ts",
  "content": "import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ParentDto {
  @ApiProperty()
  @IsString()
  name: string;
}
"
} />

<call_function id="subject-dto" name="create_file" parameters={
  "path": "src/modules/person/dto/subject.dto.ts",
  "content": "import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubjectDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  points: number;
}
"
} />

<call_function id="update-dto" name="create_file" parameters={
  "path": "src/modules/person/dto/update-person.dto.ts",
  "content": "import { PartialType } from '@nestjs/swagger';
import { CreatePersonDto } from './';

export class UpdatePersonDto extends PartialType(CreatePersonDto) {}
" 
} />

<call_function id="index-dto" name="create_file" parameters={
  "path": "src/modules/person/dto/index.ts",
  "content": "export * from './create-person.dto';
export * from './parent.dto';
export * from './subject.dto';
export * from './update-person.dto';
"
} />

Crear los ficheros de contantes

<call_function id="audit-constants" name="create_file" parameters={
  "path": "src/modules/person/constants/person-audit.constant.ts",
  "content": "export const PERSON_AUDIT = 'PERSON';
"
} />

<call_function id="permission-constants" name="create_file" parameters={
  "path": "src/modules/person/constants/person-permissions.constant.ts",
  "content": "export enum PERSON_PERMISSIONS {
  VIEW = 'PERSON_VIEW',
  WRITE = 'PERSON_WRITE',
}
"
} />

<call_function id="index-constants" name="create_file" parameters={
  "path": "src/modules/person/constants/index.ts",
  "content": "export * from './person-audit.constant';
export * from './person-permissions.constant';
"
} />

Crear la clase controladora

<call_function id="controller-class" name="create_file" parameters={
  "path": "src/modules/person/person.controller.ts",
  "content": "import { Controller, Get, Post, Body, Patch, Delete } from '@nestjs/common';
import { Audit, COMMON_EVENTS } from '@dfl-nest/audit';
import { PersonService } from './person.service';
import { CreatePersonDto, UpdatePersonDto } from './dto';
import { Person } from './entities';
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
import { PERSON_PERMISSIONS, PERSON_MODULE } from './constants';


@ApiTags('Person')
@Auth(PERSON_PERMISSIONS.VIEW)
@SpaceSecure()
@FilterSpace()
@FilterSoftDelete()
@Controller('person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Post()
  @Audit({ module: PERSON_MODULE, event: COMMON_EVENTS.CREATE, saveResponse: true })
  @AppendOwnerAndSpace()
  @Auth(PERSON_PERMISSIONS.WRITE)
  @ApiCreate('Person', CreatePersonDto, Person)
  create(@Body() createPersonDto: CreatePersonDto) {
    return this.personService.create(createPersonDto);
  }

  @Post('search')
  @FilterBody()
  @ApiSearch('Person', Person)
  findAll(@Body() options: SearchBody, @GetFilter() filter: IFilter) {
    return this.personService.search(filter, options);
  }

  @Get(':id')
  @FilterByParamId()
  @ApiGetOne('Person', 'id', Person, { mongoId: true })
  findOne(@GetFilter() filter: IFilter) {
    return this.personService.findOne(filter);
  }

  @Patch(':id')
  @Audit({ module: PERSON_MODULE, event: COMMON_EVENTS.UPDATE , saveResponse: true })
  @FilterByParamId()
  @Auth(PERSON_PERMISSIONS.WRITE)
  @ApiUpdate('Person', UpdatePersonDto, Person, { mongoId: true })
  update(@GetFilter() filter: IFilter, @Body() updatePersonDto: UpdatePersonDto) {
    return this.personService.findOneAndUpdate(filter, updatePersonDto);
  }

  @Delete(':id')
  @Audit({ module: PERSON_MODULE, event: COMMON_EVENTS.DELETED })
  @FilterByParamId()
  @Auth(PERSON_PERMISSIONS.WRITE)
  @ApiDeleteOne('Person', 'id', null, { mongoId: true })
  remove(@GetFilter() filter: IFilter) {
    return this.personService.remove(filter);
  }
}
"
} />

Crear la clase service

<call_function id="service-class" name="create_file" parameters={
  "path": "src/modules/person/person.service.ts",
  "content": "import { Injectable } from '@nestjs/common';
import { EntityService, SearchByRegex, SoftDelete } from '@dfl-nest/mongodb';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePersonDto, UpdatePersonDto } from './dto';
import { Person } from './entities';
import { ConfigService } from '@nestjs/config';

@Injectable()
@SoftDelete()
@SearchByRegex('name', 'description')
export class PersonService extends EntityService<
  Person,
  CreatePersonDto,
  UpdatePersonDto
> {
  constructor(
    @InjectModel(Person.name)
    private readonly person: Model<Person>,
    protected readonly configService: ConfigService,
  ) {
    super(person, configService);
  }
}
"
} />

Crear el módulo

<call_function id="module-class" name="create_file" parameters={
  "path": "src/modules/person/person.module.ts",
  "content": "import { Module } from '@nestjs/common';
import { PersonService } from './person.service';
import { PersonController } from './person.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Person, PersonSchema } from './entities';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Person.name,
        schema: PersonSchema,
      },
    ]),
  ],
  controllers: [PersonController],
  providers: [PersonService],
})
export class PersonModule {}
"
} />
`;
