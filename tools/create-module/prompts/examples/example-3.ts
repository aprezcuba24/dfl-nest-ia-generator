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
  "path": "person/entities/person.entity.ts",
  "content": "
import { schemaOptions, DomainSchema } from '@dfl-nest/mongodb';
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

<call_function id="entity-dto" name="create_file" parameters={
  "path": "person/dto/person.dto.ts",
  "content": "
import { DomainDto } from '@dfl-nest/mongodb';
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

export class PersonDto extends DomainDto {
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

**Subdocumento Parent**

<call_function id="parent-class" name="create_file" parameters={
  "path": "person/entities/parent.entity.ts",
  "content": "
import { Prop, Schema } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ _id: false })
export class ParentSchema {
  @ApiProperty()
  @Prop({ required: true })
  name: string;
}
"
} />

<call_function id="parent-dto" name="create_file" parameters={
  "path": "person/dto/parent.dto.ts",
  "content": "
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ParentDto {
  @ApiProperty()
  @IsString()
  name: string;
}
"
} />

**Subdocumento Subject**

<call_function id="subject-class" name="create_file" parameters={
  "path": "person/entities/subject.entity.ts",
  "content": "
import { Prop, Schema } from '@nestjs/mongoose';
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

<call_function id="subject-dto" name="create_file" parameters={
  "path": "person/dto/subject.dto.ts",
  "content": "
import { IsString } from 'class-validator';
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
`;
