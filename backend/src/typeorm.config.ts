import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  host: 'postgres',
  port: 5432,
  username: 'prac',
  password: 'prac',
  database: 'prac',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
});
