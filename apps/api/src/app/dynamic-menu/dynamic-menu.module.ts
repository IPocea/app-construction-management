import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from '../project/schemas/project.schema';
import { DynamicMenuController } from './dynamic-menu.controller';
import { DynamicMenuService } from './dynamic-menu.service';
import { CreateDynamicMenuMiddleware } from './middleware/create-dynamic-menu.middleware';
import { EditDynamicMenuMiddleware } from './middleware/edit-dynamic-menu.middleware';
import { DynamicMenu, DynamicMenuSchema } from './schemas/dynamic-menu.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DynamicMenu.name, schema: DynamicMenuSchema },
      { name: Project.name, schema: ProjectSchema },
    ]),
  ],
  controllers: [DynamicMenuController],
  providers: [DynamicMenuService],
  exports: [DynamicMenuService],
})
export class DynamicMenuModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CreateDynamicMenuMiddleware)
      .forRoutes({ path: 'dynamic-menu/:projectId/add', method: RequestMethod.POST });
    consumer
      .apply(EditDynamicMenuMiddleware)
      .forRoutes({ path: 'dynamic-menu/:id/edit', method: RequestMethod.PATCH });
  }
}
