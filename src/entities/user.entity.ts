import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'date' })
  Date: string;

  @Column({ type: 'time' })
  Time: string;

  @Column('float')
  CO_GT: number;

  @Column('float')
  PT08_S1_CO: number;

  @Column('float')
  NMHC_GT: number;

  @Column('float')
  C6H6_GT: number;

  @Column('float')
  PT08_S2_NMHC: number;

  @Column('float')
  NOx_GT: number;

  @Column('float')
  PT08_S3_NOx: number;

  @Column('float')
  NO2_GT: number;

  @Column('float')
  PT08_S4_NO2: number;

  @Column('float')
  PT08_S5_O3: number;

  @Column('float')
  T: number;

  @Column('float')
  RH: number;

  @Column('float')
  AH: number;
}