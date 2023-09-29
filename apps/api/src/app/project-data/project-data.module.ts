import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DynamicMenuService } from '../dynamic-menu/dynamic-menu.service';
import { DynamicMenu, DynamicMenuSchema } from '../dynamic-menu/schemas/dynamic-menu.schema';
import { ProjectService } from '../project/project.service';
import { Project, ProjectSchema } from '../project/schemas/project.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { CreateProjectDataCostsItemMiddleware } from './middleware/create-project-data-cost-item.middleware';

import { CreateProjectDataMiddleware } from './middleware/create-project-data.middleware';
import { GetProjectDataMiddleware } from './middleware/get-project-data.middleware';
import { UpdateDataCostsItemMiddleware } from './middleware/update-project-data.middleware';
import { ProjectDataController } from './project-data.controller';
import { ProjectDataService } from './project-data.service';
import { Dashboard, DashboardSchema } from './schemas/dashboard.schema';
import { DataCost, DataCostSchema } from './schemas/data-cost.schema';
import {
  ProjectDocument,
  ProjectDocumentSchema,
} from './schemas/document.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Dashboard.name, schema: DashboardSchema },
      { name: DataCost.name, schema: DataCostSchema },
      { name: ProjectDocument.name, schema: ProjectDocumentSchema },
      { name: Project.name, schema: ProjectSchema },
      { name: User.name, schema: UserSchema },
      { name: DynamicMenu.name, schema: DynamicMenuSchema },
    ]),
  ],
  controllers: [ProjectDataController],
  providers: [ProjectDataService, ProjectService, UsersService, DynamicMenuService],
  exports: [ProjectDataService],
})
export class ProjectDataModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CreateProjectDataMiddleware).forRoutes({
      path: 'project-details/add/:tabType',
      method: RequestMethod.POST,
    });
    consumer.apply(CreateProjectDataCostsItemMiddleware).forRoutes({
      path: 'project-details/data-costs-data/:id/add',
      method: RequestMethod.POST,
    });
    consumer.apply(UpdateDataCostsItemMiddleware).forRoutes({
      path: 'project-details/data-costs-data/:id/:dataItemId/edit',
      method: RequestMethod.PATCH,
    });
    // consumer.apply(GetProjectDataMiddleware).forRoutes({
    //   path: 'project-details/:projectId/:itemId/:tabType',
    //   method: RequestMethod.GET,
    // });
  }
}
