import identity from "./includes/identity";
import instructions from "./includes/instructions";

export default `
${identity}

${instructions}

Las librerías que utilizan son:

- @dfl-nest/mongodb que exporta las clases "DomainSchema" y "schemaOptions" que se utilizan para crear la clase entidad.
- @nestjs/mongoose que exporta las clases "Prop" y "Schema" y "SchemaFactory" que se utilizan para crear la clase entidad.
- @nestjs/swagger que exporta la clase "ApiProperty" que se utilizan para crear la clase entidad.
- class-validator tiene las validaciones que se deben poner en las clases DTO
- @dfl-nest/mongodb también exporta la clase "DomainDto" que se utiliza para crear la clase dto

## Tarea
- Genera el nombre que va a tener el módulo que sería el nombre de la entidad en **Kebab Case**,
  por ejemplo si el nombre de la entidad es "CategoryProduct" el nombre del módulo sería "category-product"
- Primero generar la clase entidad con los campos y subdocumentos
- Los subdocumentos van en ficheros diferentes y se ponen después como un campo de la clase principal.
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

<call_function id="entity-class" name="create_file" parameters={
  "path": "src/modules/category/entities/category.entity.ts",
  "content": "import { schemaOptions, DomainSchema } from '@dfl-nest/mongodb';
import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema(schemaOptions)
export class Category extends DomainSchema {
  @ApiProperty()
  @Prop()
  name: string;

  @ApiProperty()
  @Prop({ type: String, required: false })
  description: string;

  @ApiProperty()
  @Prop({ type: Boolean })
  isActive: boolean;

  @ApiProperty()
  @Prop({ type: Number })
  order: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ createdAt: 1 })
UserSchema.index({ space: 1, deleted: 1 })
"
} />

<call_function id="index" name="create_file" parameters={
  "path": "src/modules/category/entities/index.ts",
  "content": "export * from './category.entity';"
} />

## Example 2

Crear un módulo para la entidad *User*

<user_query>
class User
name string
age number default 10
spaces array of string
role enum (admin, user) required
</user_query>

<call_function id="entity-class" name="create_file" parameters={
  "path": "src/modules/user/entities/user.entity.ts",
  "content": "import { schemaOptions, DomainSchema } from '@dfl-nest/mongodb';
import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Role } from '../constants';

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

  @ApiProperty()
  @Prop({ enum: Role, required: true })
  role: Role;
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
`;
