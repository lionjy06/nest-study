import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    description: 'email',
    example: 'abc@gmail.com',
  })
  @Column()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    description: 'nickanme',
    example: 'cookieyam',
  })
  @Column()
  nickname: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    description: 'write first name',
    example: 'Jinyoung',
  })
  @Column()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    description: 'write last name',
    example: 'Yang',
  })
  @Column()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    description: 'wrtie password',
    example: '1q2w3e4r',
  })
  @Column()
  password: string;
}
