import { Controller, Get } from '@nestjs/common';
import { ITokens } from './interface/tokens.interface';
import { TokenService } from './token.service';

@Controller('tokens')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Get()
  async findAll(): Promise<ITokens[]> {
    const tokens = await this.tokenService.findAll();
    if (tokens) {
      return tokens;
    }
  }
}
