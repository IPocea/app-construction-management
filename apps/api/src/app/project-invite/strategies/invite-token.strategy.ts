import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from '../../auth/constants';
import { ProjectInviteService } from '../project-invite.service';
import {
  IPayload,
  IValidateStrategyResponse,
} from '../../auth/interface/payload.interface';

@Injectable()
export class InviteTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-invite'
) {
  constructor(private projectInviteService: ProjectInviteService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.inviteTokenSecret,
    });
  }

  async validate(payload: IPayload): Promise<IValidateStrategyResponse> {
    const inviteToken = await this.projectInviteService.validateInviteToken(
      payload
    );
    if (!inviteToken) {
      throw new UnauthorizedException();
    }
    return {
      _id: payload.sub,
      email: payload.email,
    };
  }
}
