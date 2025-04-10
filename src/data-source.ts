import { DataSource } from 'typeorm';
import { User, Blog, Tag, Role } from './entity';

let dataSource: DataSource | undefined = undefined;

export function getAppDataSource() {
  if (!dataSource) {
    dataSource = new DataSource({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT!),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      logging: false,
      entities: [User, Blog, Tag, Role],
      ssl: {
        rejectUnauthorized: false,
      },
    });
  }
  return dataSource;
}
