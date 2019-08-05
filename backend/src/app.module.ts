import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TaskModule } from './task/task.module';
import { CommentModule } from './comment/comment.module';
import { RolesGuard } from './roles.guard';
import { MailModule } from './mail/mail.module';
import config from 'config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      ...config.get('db'),
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      retryDelay: 5000,
      logging: process.env.NODE_ENV === 'development',
    }),
    UserModule,
    AuthModule,
    TaskModule,
    CommentModule,
    MailModule.forRoot({
      ...config.get('mail'),
      template: {
        dir: __dirname + '/templates',
        strict: true,
      },
    }),
  ],
  controllers: [],
  providers: [RolesGuard],
})
export class AppModule {}
