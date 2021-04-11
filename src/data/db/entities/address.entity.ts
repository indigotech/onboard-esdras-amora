import { PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Entity, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('address')
export class AddressEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  cep!: string;

  @Column()
  street!: string;

  @Column()
  streetNumber!: string;

  @Column({ nullable: true })
  complement?: string;

  @Column()
  neighborhood!: string;

  @Column()
  city!: string;

  @Column()
  state!: string;

  @Column({ nullable: true })
  userId?: string;

  @ManyToOne(() => UserEntity, (user) => user.addresses, { cascade: true, onDelete: 'CASCADE' })
  user!: UserEntity;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
