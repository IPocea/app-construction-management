export interface ITokens {
  _id?: string;
  userId: string;
  refreshToken?: string | null;
  resetPasswordToken?: string | null;
  inviteToken?: string | null;
  __V?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
