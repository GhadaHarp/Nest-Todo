import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodoModule } from './Todos/todo.module';
import { UsersModule } from './modules/users/users.module';
import { LoggerMiddleWare } from './middlewares/logger.middleware';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/jwt.strategy';

@Module({
  imports: [
    TodoModule,
    UsersModule,
    AuthModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'SECRET',
      signOptions: { expiresIn: '1d' },
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      process.env.MONGO_URI ||
        'mongodb+srv://ghada:mbwTVGKJkm4gt37E@cluster0.akoq5.mongodb.net/',
    ),
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleWare).forRoutes('*');
  }
}
