export default `
# Example 2

Crear un módulo para la entidad *User*

<user_query>
class User
name string
age number default 10
spaces array of string
</user_query>

<call_function id="entity-class" name="create_file" parameters={
  "path": "src/modules/user/entities/user.entity.ts",
  "content": "import { schemaOptions, DomainSchema } from '@dfl-nest/mongodb';
import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema(schemaOptions)
export class User extends DomainSchema {
  @ApiProperty()
  @Prop()
  name: string;

  @ApiProperty()
  @Prop({ type: Number, default: 10 })
  age: number;

  @ApiProperty()
  @Prop({ type: [String] })
  spaces: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ createdAt: 1 })
UserSchema.index({ space: 1, deleted: 1 })
"
} />

<call_function id="index" name="create_file" parameters={
  "path": "src/modules/user/entities/index.ts",
  "content": "export * from './user.entity';"
} />

Crear las clases dto

<call_function id="entity-dto" name="create_file" parameters={
  "path": "src/modules/user/dto/create-user.dto.ts",
  "content": "import { DomainDto } from '@dfl-nest/mongodb';
import { IsBoolean, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateUserDto extends DomainDto {
  @IsString()
  name: string;

  @IsNumber()
  @IsOptional()
  age: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  spaces: string[];
}
" 
} />

<call_function id="update-dto" name="create_file" parameters={
  "path": "src/modules/user/dto/update-user.dto.ts",
  "content": "import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
" 
} />

<call_function id="index-dto" name="create_file" parameters={
  "path": "src/modules/user/dto/index.ts",
  "content": "export * from './create-user.dto';
export * from './update-user.dto';
"
} />

Crear los ficheros de contantes

<call_function id="audit-constants" name="create_file" parameters={
  "path": "src/modules/user/constants/user-audit.constant.ts",
  "content": "export const USER_AUDIT = 'USER';
"
} />

<call_function id="permission-constants" name="create_file" parameters={
  "path": "src/modules/user/constants/user-permissions.constant.ts",
  "content": "export enum USER_PERMISSIONS {
  VIEW = 'USER_VIEW',
  WRITE = 'USER_WRITE',
}
"
} />

<call_function id="index-constants" name="create_file" parameters={
  "path": "src/modules/user/constants/index.ts",
  "content": "export * from './user-audit.constant';
export * from './user-permissions.constant';
"
} />

Crear la clase controladora

<call_function id="controller-class" name="create_file" parameters={
  "path": "src/modules/user/user.controller.ts",
  "content": "import { Controller, Get, Post, Body, Patch, Delete } from '@nestjs/common';
import { Audit, COMMON_EVENTS } from '@dfl-nest/audit';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { User } from './entities';
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
import { USER_PERMISSIONS, USER_MODULE } from './constants';


@ApiTags('User')
@Auth(USER_PERMISSIONS.VIEW)
@SpaceSecure()
@FilterSpace()
@FilterSoftDelete()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Audit({ module: USER_MODULE, event: COMMON_EVENTS.CREATE, saveResponse: true })
  @AppendOwnerAndSpace()
  @Auth(USER_PERMISSIONS.WRITE)
  @ApiCreate('User', CreateUserDto, User)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('search')
  @FilterBody()
  @ApiSearch('User', User)
  findAll(@Body() options: SearchBody, @GetFilter() filter: IFilter) {
    return this.userService.search(filter, options);
  }

  @Get(':id')
  @FilterByParamId()
  @ApiGetOne('User', 'id', User, { mongoId: true })
  findOne(@GetFilter() filter: IFilter) {
    return this.userService.findOne(filter);
  }

  @Patch(':id')
  @Audit({ module: USER_MODULE, event: COMMON_EVENTS.UPDATE , saveResponse: true })
  @FilterByParamId()
  @Auth(USER_PERMISSIONS.WRITE)
  @ApiUpdate('User', UpdateUserDto, User, { mongoId: true })
  update(@GetFilter() filter: IFilter, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.findOneAndUpdate(filter, updateUserDto);
  }

  @Delete(':id')
  @Audit({ module: USER_MODULE, event: COMMON_EVENTS.DELETED })
  @FilterByParamId()
  @Auth(USER_PERMISSIONS.WRITE)
  @ApiDeleteOne('User', 'id', null, { mongoId: true })
  remove(@GetFilter() filter: IFilter) {
    return this.userService.remove(filter);
  }
}
"
} />

Crear la clase service

<call_function id="service-class" name="create_file" parameters={
  "path": "src/modules/user/user.service.ts",
  "content": "import { Injectable } from '@nestjs/common';
import { EntityService, SearchByRegex, SoftDelete } from '@dfl-nest/mongodb';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto, UpdateUserDto } from './dto';
import { User } from './entities';
import { ConfigService } from '@nestjs/config';

@Injectable()
@SoftDelete()
@SearchByRegex('name', 'description')
export class UserService extends EntityService<
  User,
  CreateUserDto,
  UpdateUserDto
> {
  constructor(
    @InjectModel(User.name)
    private readonly user: Model<User>,
    protected readonly configService: ConfigService,
  ) {
    super(user, configService);
  }
}
"
} />

Crear el módulo

<call_function id="module-class" name="create_file" parameters={
  "path": "src/modules/user/user.module.ts",
  "content": "import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
"
} />
`;
