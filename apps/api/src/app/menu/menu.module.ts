import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MenuMiddleware } from './middleware/menu.middleware';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { Menu, MenuSchema } from './schemas/menu.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Menu.name, schema: MenuSchema }]),
  ],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [MenuService],
})
export class MenuModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(MenuMiddleware)
      .forRoutes({ path: 'menu', method: RequestMethod.POST });
  }
}
