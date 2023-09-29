import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VerifySignup } from './middleware/verifySignup.middleware';
import { RegistrationController } from '../registration/registration.controller';
import { VerifySignupService } from '../services/verifySignup.service';
import { User, UserSchema } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [RegistrationController],
  providers: [UsersService, VerifySignupService],
})
export class RegistrationModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifySignup)
      .forRoutes({ path: 'registration', method: RequestMethod.POST });
  }
}
