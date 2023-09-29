import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DynamicMenuModule } from '../dynamic-menu/dynamic-menu.module';
import { DynamicMenuService } from '../dynamic-menu/dynamic-menu.service';
import {
  DynamicMenu,
  DynamicMenuSchema,
} from '../dynamic-menu/schemas/dynamic-menu.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { CreateProjectMiddleware } from './middleware/create-project.middleware';
import { UpdateProjectMiddleware } from './middleware/update-project.middleware';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { Project, ProjectSchema } from './schemas/project.schema';

@Module({
  imports: [
    DynamicMenuModule,
    UsersModule,
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema },
      { name: DynamicMenu.name, schema: DynamicMenuSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [ProjectController],
  providers: [ProjectService, DynamicMenuService, UsersService],
  exports: [ProjectService],
})
export class ProjectModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CreateProjectMiddleware).forRoutes({
      path: 'project/add',
      method: RequestMethod.POST,
    });
    consumer.apply(UpdateProjectMiddleware).forRoutes({
      path: 'project/:id',
      method: RequestMethod.PATCH,
    });
  }
}
