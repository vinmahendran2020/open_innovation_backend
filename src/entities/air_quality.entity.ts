import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('air_quality')
export class AirQuality {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'time' })
  time: string;

  @Column('float')
  co_gt: number;

  @Column('float')
  pt08_s1_co: number;

  @Column('float')
  nmhc_gt: number;

  @Column('float')
  c6h6_gt: number;

  @Column('float')
  pt08_s2_nmhc: number;

  @Column('float')
  nox_gt: number;

  @Column('float')
  pt08_s3_nox: number;

  @Column('float')
  no2_gt: number;

  @Column('float')
  pt08_s4_no2: number;

  @Column('float')
  pt08_s5_o3: number;

  @Column('float')
  t: number;

  @Column('float')
  rh: number;

  @Column('float')
  ah: number;
}
