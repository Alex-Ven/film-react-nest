// import { Module } from '@nestjs/common';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { Film } from '../films/entities/film.entity';
// import { Schedule } from '../films/entities/schedule.entity';

// @Module({
//   imports: [
//     TypeOrmModule.forRootAsync({
//       imports: [ConfigModule],
//       useFactory: (configService: ConfigService) => ({
//         type: 'postgres',
//         host: configService.get('POSTGRES_HOST'),
//         port: configService.get('POSTGRES_PORT'),
//         username: configService.get('POSTGRES_USER'),
//         password: configService.get('POSTGRES_PASSWORD'),
//         database: configService.get('POSTGRES_DATABASE'),
//         entities: [Film, Schedule],
//         synchronize: false,
//         logging: true,
//       }),
//       inject: [ConfigService],
//     }),
//     TypeOrmModule.forFeature([Film, Schedule]),
//   ],
//   exports: [TypeOrmModule],
// })
// export class TypeOrmConfigModule {}
