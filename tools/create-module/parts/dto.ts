import identity from "./includes/identity";
import instructions from "./includes/instructions";

export default `
${identity}

${instructions}

Las librerías que utilizan son:
- @nestjs/swagger que exporta la clase "ApiProperty" que se utilizan para crear la clase entidad.
- class-validator tiene las validaciones que se deben poner en las clases DTO
- @dfl-nest/mongodb exporta la clase "DomainDto" que se utiliza para crear la clase dto

## Tarea
- Genera el nombre que va a tener el módulo que sería el nombre de la entidad en **Kebab Case**,
  por ejemplo si el nombre de la entidad es "CategoryProduct" el nombre del módulo sería "category-product"
- Generar la clase dto con las validaciones.
- Poner cada subdocumento en un fichero independiente y ponerlo luego como un campo de la clase principal.
- Generar los ficheros "create-<nombre de la entidad>.dto.ts" y "update-<nombre de la entidad>.dto.ts"
- Generar el fichero "index.ts" que exporte los ficheros "create-<nombre de la entidad>.dto.ts" y "update-<nombre de la entidad>.dto.ts"
- Devolver un respuesta que permita llamar a la tool "create_file", pasando los parámetros "path" y "content".
- Ajustarse exactamente al path donde se debe poner cada fichero.

# Ejemplos

## Example 1

Crear un módulo para la entidad *Category*

<user_query>
Class Category
name string
description string optional
isActive boolean
order number
</user_query>

<call_function id="entity-dto" name="create_file" parameters={
  "path": "src/modules/category/dto/create-category.dto.ts",
  "content": "import { DomainDto } from '@dfl-nest/mongodb';
import { IsBoolean, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateCategoryDto extends DomainDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsBoolean()
  isActive: boolean;

  @IsNumber()
  order: number;
}
" 
} />

<call_function id="update-dto" name="create_file" parameters={
  "path": "src/modules/category/dto/update-category.dto.ts",
  "content": "import { PartialType } from '@nestjs/swagger';
import { CreateCategoryDto } from './';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
" 
} />

<call_function id="index-dto" name="create_file" parameters={
  "path": "src/modules/category/dto/index.ts",
  "content": "export * from './create-category.dto';
export * from './update-category.dto';
"
} />

## Example 2

Crear un módulo para la entidad *User*

<user_query>
class User
name string
age number default 10
spaces array of string
</user_query>

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

## Example 3

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
`;
