import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class MemberDto {
  @ApiProperty({
    required: true,
    example: "Raden@tes.ac",
    description: "Input member email",
  })
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    required: false,
    example: false,
    description: 'decide show all data or not',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ obj, key }) => {
    return obj[key] === 'true' ? true : obj[key] === 'false' ? false : obj[key];
  })
  is_admin?: boolean = false;

  @ApiProperty({
    required: true,
    example: "M00112",
    description: "Input member password",
  })
  @Type(() => String)
  @IsNotEmpty()
  @IsString()
  password: string;
}
