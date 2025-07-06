import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../../common/enums/rol.enum';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Entity representing a User.
 */
@Entity()
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false, select: false })
  password: string; // Hidden field, not exposed in queries or Swagger

  @ApiProperty({ enum: Role, default: Role.USER })
  @Column({ type: 'enum', default: Role.USER, enum: Role })
  role: Role;

  @ApiProperty({ type: Date, required: false })
  @DeleteDateColumn()
  deleteAd: Date; // Soft deletion timestamp
}
