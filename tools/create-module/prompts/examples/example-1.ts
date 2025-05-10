export default `
# Example 1

Crear un módulo para la entidad *Category*

<user_query>
Class Category
name string
description string optional
isActive boolean
order number
</user_query>

<call_function id="entity-class" name="create_file" parameters={
  "path": "category/entities/category.entity.ts",
  "content": "
import { schemaOptions, DomainSchema } from '@dfl-nest/mongodb';
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

<call_function id="entity-dto" name="create_file" parameters={
  "path": "category/dto/category.dto.ts",
  "content": "
import { DomainDto } from '@dfl-nest/mongodb';
import { IsBoolean, IsNumber, IsString, IsOptional } from 'class-validator';

export class CategoryDto extends DomainDto {
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
`;
