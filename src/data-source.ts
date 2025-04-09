import { DataSource } from 'typeorm'
import { User } from './entity/user'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'pg-3dbef891-amlfakhry13-5f34.b.aivencloud.com',
  port: 26362,
  username: 'avnadmin',
  password: 'AVNS_PnZ7B1RNH39TpDbfWQN',
  database: 'Blog-Management-System',
  synchronize: true,
  logging: false,
  entities: [User],
})
