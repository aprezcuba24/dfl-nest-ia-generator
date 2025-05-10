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
  "path": "user/entities/user.entity.ts",
  "content": "
import { schemaOptions, DomainSchema } from '@dfl-nest/mongodb';
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

<call_function id="entity-dto" name="create_file" parameters={
  "path": "user/dto/user.dto.ts",
  "content": "
import { DomainDto } from '@dfl-nest/mongodb';
import { IsBoolean, IsNumber, IsString, IsOptional } from 'class-validator';

export class UserDto extends DomainDto {
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
`;
