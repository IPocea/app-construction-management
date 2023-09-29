import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from '../auth/auth.service';
import { ProjectModule } from '../project/project.module';
import { ProjectService } from '../project/project.service';
import { Project, ProjectSchema } from '../project/schemas/project.schema';
import { Token, TokenSchema } from '../token/schemas/token.schema';
import { TokenModule } from '../token/token.module';
import { TokenService } from '../token/token.service';
import { User, UserSchema } from '../users/schemas/user.schema';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { ProjectInviteController } from './project-invite.controller';
import { ProjectInviteService } from './project-invite.service';
import { InviteTokenStrategy } from './strategies/invite-token.strategy';
import { DynamicMenuModule } from '../dynamic-menu/dynamic-menu.module';
import { DynamicMenuService } from '../dynamic-menu/dynamic-menu.service';
import {
  DynamicMenu,
  DynamicMenuSchema,
} from '../dynamic-menu/schemas/dynamic-menu.schema';

@Module({
  imports: [
    TokenModule,
    UsersModule,
    PassportModule,
    ProjectModule,
    DynamicMenuModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Token.name, schema: TokenSchema },
      { name: Project.name, schema: ProjectSchema },
      { name: DynamicMenu.name, schema: DynamicMenuSchema },
    ]),
    JwtModule.register({}),
  ],
  controllers: [ProjectInviteController],
  providers: [
    ProjectInviteService,
    UsersService,
    AuthService,
    TokenService,
    ProjectService,
    InviteTokenStrategy,
    DynamicMenuService,
  ],
  exports: [ProjectInviteService],
})
export class ProjectInviteModule {}
