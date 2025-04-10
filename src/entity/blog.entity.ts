import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Tag } from './tag.entity';

@Entity()
export class Blog {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column('text')
  content!: string;

  @ManyToMany(() => Tag, (tag) => tag.blogs, { cascade: true })
  @JoinTable()
  tags!: Tag[];
}
