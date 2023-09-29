import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VerifyModify } from './middleware/verifyModify.middleware';
import { VerifySignupService } from '../services/verifySignup.service';
import { User, UserSchema } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { ProfileController } from './profile.controllers';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [ProfileController],
  providers: [VerifySignupService, UsersService],
})
export class ProfileModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyModify)
      .forRoutes({ path: 'profile/:id', method: RequestMethod.PATCH });
  }
}
