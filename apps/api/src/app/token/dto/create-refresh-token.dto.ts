export class CreateRefreshTokenDto {
  userId: string;
  refreshToken?: string;
  resetPasswordToken?: string;
  inviteToken?: string;
}
