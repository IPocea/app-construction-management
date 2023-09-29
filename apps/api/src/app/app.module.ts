import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
// We need ConfigModule to be able to read .env file
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProfileModule } from './profile/profile.module';
import { RegistrationModule } from './registration/registration.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TokenModule } from './token/token.module';
import { MailModule } from './mail/mail.module';
import { MenuModule } from './menu/menu.module';
import { ProjectDataModule } from './project-data/project-data.module';
import { ProjectModule } from './project/project.module';
import { MulterModule } from '@nestjs/platform-express';
import { DynamicMenuModule } from './dynamic-menu/dynamic-menu.module';
import { ProjectInviteModule } from './project-invite/project-invite.module';


@Module({
  imports: [
    RegistrationModule,
    UsersModule,
    ProfileModule,
    AuthModule,
    TokenModule,
    MailModule,
    MenuModule,
    ProjectDataModule,
    ProjectModule,
    DynamicMenuModule,
    ProjectInviteModule,
    MongooseModule.forRoot(
      `mongodb+srv://refer-me:${process.env.mongoDBPass}@cluster0.v9ozn3h.mongodb.net/refer-me?retryWrites=true&w=majority`
    ),
    ConfigModule.forRoot(),
    MulterModule.registerAsync({
      useFactory: () => ({
        dest: './apps/api/src/files',
      }),
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
