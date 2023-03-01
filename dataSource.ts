import dotenv from 'dotenv';
//dataSource에 entity를 입력해줄때는 절대경로면 못찾아온다. 그래서 상대 경로로 써줘야함
import { User } from './src/users/entities/user.entity';
import { DataSource } from 'typeorm';

const mode = process.env.NODE_ENV || 'development';
dotenv.config({ path: process.cwd() + `/.env.${mode}` });

const dataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  database: process.env.DB_DATABASE,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  charset: 'utf8mb4_general_ci',
  entities: [User],
  migrations: [__dirname + '/src/migrations/*.ts'],
  synchronize: true,
  logging: true,
});
export default dataSource;
