import { Module } from '@nestjs/common';
import { DynamicMenuNotUsedController } from './dynamic-menu-not-used.controller';
import { DynamicMenuNotUsedService } from './dynamic-menu-not-used.service';

@Module({
  imports: [],
  controllers: [DynamicMenuNotUsedController],
  providers: [DynamicMenuNotUsedService],
  exports: [DynamicMenuNotUsedService],
})
export class DynamicModule {}
