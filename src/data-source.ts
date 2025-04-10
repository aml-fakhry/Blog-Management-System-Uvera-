import { DataSource } from 'typeorm';
import { User } from './entity/user.entity';
import { Blog } from './entity/blog.entity';
import { Tag } from './entity/tag.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'pg-3dbef891-amlfakhry13-5f34.b.aivencloud.com',
  port: 26362,
  username: 'avnadmin',
  password: 'AVNS_PnZ7B1RNH39TpDbfWQN',
  database: 'Blog-Management-System',
  synchronize: true,
  logging: false,
  entities: [User, Blog, Tag],
  ssl: {
    rejectUnauthorized: false,
  },
});
